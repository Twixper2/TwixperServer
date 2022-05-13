var express = require("express");
var router = express.Router();
const database = require("../../business_logic/db/DBCommunicator.js");
const participantsService_new = require("../../service/participants/participantsService_new.js");
const participantsService_selenium = require("../../service/participants/participantsService_selenium.js");
const { tabsHashMap } = require("../../config");


/**
 * Requesting user's credentials, and selenium webdriver will log in to it
 */
router.post("//twitterSeleniumAuth", async (req, res, next) => {
  const params = req.body
  // If there are no params at all,
  // Or no pass or no user params
  if(!params || !params.user || !params.pass){
    res.status(401).send("No params supplied.")
    return
  }
  try{
    let user_and_pass_encrypted = encryptToken(params.user + params.pass);
    let user_value_from_hashmap = tabsHashMap.get(user_and_pass_encrypted);
    // First, Check if there is already a tab open for the user
    if(tabsHashMap.size > 0 && user_value_from_hashmap != undefined){
      // return user_value_from_hashmap[1];
      res.status(200).send(user_value_from_hashmap);
    }

    // if(tabsHashMap.size > 0 && tabsHashMap.get(params.user) != undefined){
    //   var tab = tabsHashMap.get(params.user);
    //   await tab.getWindowHandle();
    //   res.status(400).send("This user has already been authenticated.")
    //   return
    // }

    const loginRequest = await participantsService_selenium.logInProcess(params);
    if(loginRequest != undefined){
      // Get User entity
      res.status(200).send(loginRequest);
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
      return
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
