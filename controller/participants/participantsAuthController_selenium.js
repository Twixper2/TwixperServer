var express = require("express");
var router = express.Router();
const database = require("../../business_logic/db/DBCommunicator.js");
const participantsService_selenium = require("../../service/participants/participantsService_selenium.js");
const bcrypt = require("bcryptjs");

/**
 * Requesting user's credentials, and selenium webdriver will log in to it
 */
 router.post("/twitterSeleniumAuth", async (req, res, next) => {
  const params = req.body
  // If there are no params at all,
  // Or no pass or no user params
  if(!params || !params.user || !params.pass){
    res.status(400).send("No params supplied.")
    return
  }
  try{
    const loginRequest = await participantsService_selenium.logInProcess(params);
    //TODO: If login request is fine -
    // save credentials so we will not open another tab
    // for this user
    //TODO: Also, save tab object on db
    // so we can continue work with it.
    res.send(loginRequest[0]);
  }
  catch(e){
    console.log(e)
    if(e.message){ // error thrown from the api
      res.status(502).json(e);
    }
    else{ // Internal error
      res.sendStatus(500)
    }
  }
})


module.exports = router;
