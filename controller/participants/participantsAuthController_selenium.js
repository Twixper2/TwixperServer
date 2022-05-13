var express = require("express");
var router = express.Router();
const database = require("../../business_logic/db/DBCommunicator.js");
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
    // First, Check if there is already a tab open for the user
    if(tabsHashMap.size > 0 && tabsHashMap.get(params.user) != undefined){
      var tab = tabsHashMap.get(params.user);
      await tab.getWindowHandle();
      // Return 200 with the details on the user
      res.status(400).send("This user has already been authenticated.")
      return
    }

    const loginRequest = await participantsService_selenium.logInProcess(params);
    if(loginRequest === "Successfully signed in twitter!"){
      res.status(200).send(loginRequest);
    }
    else{
      res.status(401).send(loginRequest);
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
    if(e.message){ // error thrown from the api
      res.status(500).json(e);
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

// router.post("//registerToExperiment", async (req, res, next) => {
//   try {
//     // validate request params and cookies
//     const expCode = req.body.exp_code
//     if (!expCode) {
//       res.status(400).send("No experiment code provided.")
//       return;
//     }

//     if(!req.header('User-Twitter-Token') || !req.header('User-Twitter-Token-Secret')){
//       res.status(428).send("Missing auth headers (User-Twitter-Token, User-Twitter-Token-Secret)");
//       return;
//       /*
//         The HTTP 428 Precondition Required response status code indicates that the server requires
//         the request to be conditional. Typically, this means that a required precondition header, 
//         such as If-Match , is missing.
//       */
//     }
//     /*if (!req.session || !req.session.userTwitterToken || !req.session.userTwitterTokenSecret) {
//       res.status(401).send("Login with twitter first.");
//       return;
//     }*/

//     // const oauthToken = req.session.userTwitterToken
//     // const oauthTokenSecret = req.session.userTwitterTokenSecret    
    
//     // TODO: Decrypt tokens
//     const oauthToken = req.header('User-Twitter-Token')
//     const oauthTokenSecret = req.header('User-Twitter-Token-Secret')    
    
//     // trying registering user
//     let participant  = null
//     try {
//       participant = await participantsService.registerParticipant(oauthToken, oauthTokenSecret, expCode)
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
//     const participant_twitter_info = participantsService.extractTwitterInfoFromParticipantObj(participant)
//     res.status(200).json({"participant_twitter_info": participant_twitter_info}); //success
//   } // end try
//   catch(e) {
//     console.log(e)
//     res.sendStatus(500);
//   }
// });

// function encryptToken(token) {
//   return bcrypt.hashSync(token, 10)
// }

module.exports = router;
