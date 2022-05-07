var express = require("express");
var router = express.Router();
const participantsService_selenium = require("../../service/participants/participantsService_selenium.js");
const database = require("../../business_logic/db/DBCommunicator.js")
const { tabsHashMap } = require("../../config");


/* ----------------------------------------
    Routes for asking for data from Twitter
   ---------------------------------------- */

router.get("//getWhoToFollow", async (req, res, next) => {
  const params = req.body
  // If there are no params at all,
  // Or no pass or no user params
  if(!params || !params.user || !params.pass){
    res.status(400).send("No params supplied.")
    return
  }
  try{
    // First, Check if there is already a tab open for the user
    if(tabsHashMap.size == 0 || tabsHashMap.get(params.user) == undefined){
      res.status(400).send("This user is not authenticated.")
      return
    }

    const whoToFollowElement = await participantsService_selenium.getWhoToFollow(params);
    res.send(whoToFollowElement);
    return
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
});

router.get("//getNTweets", async (req, res, next) => {
  const params = req.body
  // If there are no params at all,
  // Or no pass or no user params
  if(!params || !params.user || !params.pass || !params.number_of_tweets){
    res.status(400).send("No params supplied.")
    return
  }
  try{
    // First, Check if there is already a tab open for the user
    if(tabsHashMap.size == 0 || tabsHashMap.get(params.user) == undefined){
      res.status(400).send("This user is not authenticated.")
      return
    }

    const get_n_first_tweets = await participantsService_selenium.get_n_first_tweets(params);
    res.send(get_n_first_tweets);
    return
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
});


module.exports = router;
