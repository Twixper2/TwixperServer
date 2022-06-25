var express = require("express");
var router = express.Router();
const database = require("../../business_logic/db/DBCommunicator.js");
const bcrypt = require("bcryptjs");
const participantsService_selenium = require("../../service/participants/participantsService_selenium.js");
const participantAuthUtils_selenium = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils_selenium.js");
const { tabsHashMap } = require("../../config");

/**
 * Requesting user's credentials, and selenium webdriver will log in to it
 */
router.post("//twitterSeleniumAuth", async (req, res, next) => {
  const params = req.body;
  if(!params || !params.user || !params.pass){
    res.status(401).send("No params supplied.")
    return
  }
  try{    
    // Function checks in tabHashmap and DB for already auth'ed user.
    let authCheckResults = await participantAuthUtils_selenium.getUserAuthDetsIfExist(params);
    let login_response = null;
    let initial_content = authCheckResults.twitter_data_to_send;

    if(initial_content == null){
      login_response = await participantsService_selenium.logInProcess(params,authCheckResults.user_and_pass_encrypted);
      if(!login_response){
        params?.tab?.close();
        res.status(400).json({
          twitter_user_found : false,
          user_registered_to_experiment : false
        });
        return;
      }
      initial_content = login_response;
    }
    if(login_response){
    // Check if already registered to exp'
      let participant = await database.getParticipantByUsername(params.user);
      if (participant) {
        // Extract data from collection
        let participant_twitter_info = participantsService_selenium.extractTwitterInfoFromParticipantObj(participant)
        initial_content = await  participantsService_selenium.firstLoginDataExtraction(login_response,params)
        res.status(200).json({
          twitter_user_found : true,
          user_registered_to_experiment : true,
          participant_twitter_info,
          initial_content
        });
        return;
      }
    // Not registered
    res.status(200).json({
      twitter_user_found : true,
      user_registered_to_experiment : false,
      access_token : params.access_token
    });
    }



  }
  catch(e){
    console.log(e)
    // Chrome is not reachable, remove tab from hashmap
    if(e.name == "WebDriverError"){
      tabsHashMap.delete(params.user);
      params?.tab?.close();
      res.status(502).json("Tab is closed for some reason. Please authenticate again.")
      return;
    }
    else{ // Internal error
      params?.tab?.close();
      res.sendStatus(500)
      return;
    }
  }
})

router.post("//registerToExperiment", async (req, res, next) => {
  try {
    const header_params = req.headers
    const expCode = req.body.exp_code
    let access_token = header_params.accesstoken;
    if(!header_params || !access_token || !header_params.user){
      res.status(400).send("No accesstoken or user params supplied in Header.");
      return;
    }
    if (!expCode) {
      res.status(400).send("No exp_code code provided in Body.");
      return;
    }
    
    let participant  = null
    try {
      let initial_content = null;
      participant = await participantsService_selenium.registerParticipant(header_params.user, access_token, expCode);
      if(participant){
        
      }
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
    const participant_twitter_info = participantsService_selenium.extractTwitterInfoFromParticipantObj(participant)
    // let initial_content = await  participantsService_selenium.firstLoginDataExtraction(login_response,params)
    // delete initial_content.tab;

    res.status(200).json({
      twitter_user_found : true,
      user_registered_to_experiment : true,
      participant_twitter_info,
      access_token,
      initial_content:participant.initial_content
    });
    return;
  } // end try
  catch(e) {
    console.log(e)
    res.sendStatus(500);
  }
});



// router.post("//registerToExperiment", async (req, res, next) => {
//   try {
//     const header_params = req.headers
//     const expCode = req.body.exp_code
//     if(!header_params || !access_token || !header_params.user){
//       res.status(400).send("No access_token or user params supplied in Header.");
//       return;
//     }
//     if (!expCode) {
//       res.status(400).send("No experiment code provided in Body.");
//       return;
//     }
    
//     let participant  = null
//     try {
//       participant = await participantsService_new.registerParticipant(access_token, expCode)
//     }
//     catch (e) {
//       // if it is an error with message, we respond with the error object containing "name" and "message" keys
//       console.log(e)
//       if (e.message) { 
//         res.status(400).json(e);
//         return;
//       }
//       throw e
//     }
//     if (!participant) { //registration failed
//       res.sendStatus(500);
//       return;
//     }
//     const participant_twitter_info = participantsService_new.extractTwitterInfoFromParticipantObj(participant)
//     res.status(200).json({"participant_twitter_info": participant_twitter_info}); //success
//   } // end try
//   catch(e) {
//     console.log(e)
//     res.sendStatus(500);
//   }
// });

module.exports = router;