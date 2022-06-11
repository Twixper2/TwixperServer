var express = require("express");
var router = express.Router();
const database = require("../../business_logic/db/DBCommunicator.js");
const bcrypt = require("bcryptjs");
const participantsService_new = require("../../service/participants/participantsService_new.js");
const participantsService_selenium = require("../../service/participants/participantsService_selenium.js");
const { tabsHashMap } = require("../../config");


/**
 * Requesting user's credentials, and selenium webdriver will log in to it
 */
router.post("//twitterSeleniumAuth", async (req, res, next) => {
  const params = req.body;
  // If there are no params at all,
  // Or no pass or no user params
  if(!params || !params.user || !params.pass){
    res.status(401).send("No params supplied.")
    return
  }
  try{    
    let user_value_from_hashmap = null;
    let cache = false;
    if(tabsHashMap.size > 0){
      for (var entry of tabsHashMap.entries()) {
        let key = entry[0],
            value = entry[1];
        if(bcrypt.compareSync(params.user + params.pass, key)){
          // Found tab open
          user_value_from_hashmap = value;
          break;
        }
      }
    }


    
    if(user_value_from_hashmap != null){
      // return profile dets etc.
      resp_without_tab_and_user = Object.assign({}, user_value_from_hashmap);
      delete resp_without_tab_and_user.tab;
      delete resp_without_tab_and_user.user;
      res.status(200).send(resp_without_tab_and_user);
      return;
    }

    
    let user_and_pass_encrypted = undefined;
    //Checks if the user give access_token, if is the same  has the one in the system -> loads the cookies
    let result = await participantsService_selenium.validateAccessToken(params);
    if(result){
      params.cookies = result.cookies;
      user_and_pass_encrypted = result.access_token;
      // Open tab again
      // Send client back his personal dets
    }
    else{
      user_and_pass_encrypted = bcrypt.hashSync(params.user + params.pass,parseInt(process.env.bcrypt_saltRounds));
    }
    

    
    const login_response = await participantsService_selenium.logInProcess(params,user_and_pass_encrypted);
    if(login_response != null){
      res.status(200).send(login_response);
    }
    else{
      res.status(401).send("Login has not been completed, please try again.");
    }
  }
  catch(e){
    console.log(e)
    // Chrome is not reachable, remove tab from hashmap
    if(e.name == "WebDriverError"){
      tabsHashMap.delete(params.user);
      res.status(502).json("Tab is closed for some reason. Please authenticate again.")
      return;
    }
    else{ // Internal error
      res.sendStatus(500)
      return;
    }
  }
})


/*
Need to implement the endpoint below
*/

router.post("//registerToExperiment", async (req, res, next) => {
  try {
    // validate request params and cookies
    const expCode = req.body.exp_code
    if (!expCode) {
      res.status(400).send("No experiment code provided.")
      return;
    }

    if(!req.header('access_token')){
      res.status(428).send("Missing auth header (access_token)");
      return;
      /*
        The HTTP 428 Precondition Required response status code indicates that the server requires
        the request to be conditional. Typically, this means that a required precondition header, 
        such as If-Match , is missing.
      */
    }  
    
    // Decrypt tokens
    const access_token = req.header('access_token')
    
    // trying registering user
    let participant  = null
    try {
      participant = await participantsService_new.registerParticipant(access_token, expCode)
    }
    catch (e) {
      // if it is an error with message, we respond with the error object containing "name" and "message" keys
      console.log(e)
      if (e.message) { 
        res.status(400).json(e);
        return;
      }
      throw e
    }
    if (!participant) { //registration failed
      res.sendStatus(500);
      return;
    }
    const participant_twitter_info = participantsService_new.extractTwitterInfoFromParticipantObj(participant)
    res.status(200).json({"participant_twitter_info": participant_twitter_info}); //success
  } // end try
  catch(e) {
    console.log(e)
    res.sendStatus(500);
  }
});

function encryptToken(token) {
  return bcrypt.hashSync(token, 10);
}

module.exports = router;
