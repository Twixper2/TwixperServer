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
      res.status(502).json(e);
      return;
    }
    else{ // Internal error
      res.sendStatus(500)
      return;
    }
  }
})


module.exports = router;
