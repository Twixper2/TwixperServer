var express = require("express");
var router = express.Router();
const participantsService_selenium = require("../../service/participants/participantsService_selenium.js");
// const database = require("../../business_logic/db/DBCommunicator.js")
const { tabsHashMap } = require("../../config");


/* ----------------------------------------
    Routes for asking for data from Twitter
   ---------------------------------------- */


   
/* Make sure user is authenticated by checking if tab is active
  is not authorized, respond with code 401 */
router.use(async function (req, res, next) {
  try{
    const params = req.body
    if(!params || !params.user || !params.pass){
      res.status(400).send("No params supplied.")
      return
    }
    if(tabsHashMap.size == 0 || tabsHashMap.get(params.user) == undefined){
      res.status(401).send("This user is not authenticated.")
      return
    }
    next();
  }
  catch(e){
    res.sendStatus(500);
  }
});

/* ----------------------------------------
    Routes for logging actions
   ---------------------------------------- */
router.post("/sendActions", async (req, res, next) => {
  const actionsToLog = req.body
  if (!actionsToLog) {
    res.status(400).send("no actions provided")
  }
  if(!participantsService_selenium.validateActionsFields(actionsToLog)){
    res.sendStatus(400).send("invalid actions format"); // Bad request
  }

  const participant = req.participant
  participantsService.logParticipantActions(participant, actionsToLog)

  res.sendStatus(200)
});

/* ----------------------------------------
    Routes for asking for data from Twitter
   ---------------------------------------- */
router.get("//getWhoToFollow", async (req, res, next) => {
  const params = req.body

  try{
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

router.get("//getFeed", async (req, res, next) => {
  const params = req.body
  try{
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


/*
Need to implement the endpoints below
*/


// router.get("//getUserFriends", async (req, res, next) => {
//   const params = req.body
//   // const participant = params.participant
//   try{
//     const userFriends = await participantsService_selenium.getUserFriends(params)
//     res.send(userFriends)
//   }
//   catch(e){
//     console.log("** Error in /participant/userFriends **")
//     console.log(e)
//     if(e.message){ // error thrown from the api
//       res.status(502).json(e); 
//     }
//     else{ // Internal error
//       res.sendStatus(500)
//     }
//   }
// });

// router.get("//getUserFollowers", async (req, res, next) => {
//   const params = req.body
//   // const participant = params.participant
//   try{
//     const userFollowers = await participantsService_selenium.getUserFollowers(params)
//     res.send(userFollowers)
//   }
//   catch(e){
//     console.log("** Error in /participant/getUserFollowers **")
//     console.log(e)
//     if(e.message){ // error thrown from the api
//       res.status(502).json(e); 
//     }
//     else{ // Internal error
//       res.sendStatus(500)
//     }
//   }
// });

// router.get("//getUserTimeline", async (req, res, next) => {
//   const params = req.body
//   try{
//     const userTimelineTweets = await participantsService_selenium.getUserTimeline(params)
//     res.send(userTimelineTweets)
//   }
//   catch(e){
//     console.log(e)
//     if(e.message == "inner-api-error"){ // error thrown from the api
//       res.status(502).json(e);
//     }
//     else{
//       res.sendStatus(500)
//     }
//   }
// });

// router.get("//getUserLikes", async (req, res, next) => {
//   const params = req.body
//   // const participant = params.participant
//   try{
//     const userLikesTweets = await participantsService_selenium.getUserLikes(params)
//     res.send(userLikesTweets)
//   }
//   catch(e){
//     console.log("** Error in /participant/getUserLikes **")
//     console.log(e)
//     if(e.message){ // error thrown from the api
//       res.status(502).json(e); 
//     }
//     else{ // Internal error
//       res.sendStatus(500)
//     }
//   }
// });

// /* ----------------------------------------
//     Routes for making active actions in Twitter
//    ---------------------------------------- */
// router.post("//likeTweet", async (req, res, next) => {
//   const tweetId = req.query.tweetId
//   if (!tweetId) {
//     res.status(400).send("No tweet id provided.")
//     return;
//   }
//   const participant = req.participant
//   try{
//     const likeSuccess = await participantsService_selenium.likeTweet(participant, tweetId)
//     if(likeSuccess){
//       res.sendStatus(200)
//     }
//     else{
//       res.sendStatus(500)
//     }
//   }
//   catch(e){
//     console.log("** Error in /participant/likeTweet **")
//     console.log(e)
//     if(e.message){ // error thrown from the api
//       // pay attention to e.code == 139: "You have already favorited this status".
//       res.status(502).json(e); 
//     }
//     else{ // Internal error
//       res.sendStatus(500)
//     }
//   }
// });

// router.post("//unlikeTweet", async (req, res, next) => {
//   const tweetId = req.query.tweetId
//   if (!tweetId) {
//     res.status(400).send("No tweet id provided.")
//     return;
//   }
//   const participant = req.participant
//   try{
//     const unlikeSuccess = await participantsService_selenium.unlikeTweet(participant, tweetId)
//     if(unlikeSuccess){
//       res.sendStatus(200)
//     }
//     else{
//       res.sendStatus(500)
//     }
//   }
//   catch(e){
//     console.log("** Error in /participant/unlikeTweet **")
//     console.log(e)
//     if(e.message){ // error thrown from the api
//       /* pay attention to e.code == 144: "No status found with that ID".
//          That error code returns when the tweet is already unliked. */
//       res.status(502).json(e); 
//     }
//     else{ // Internal error
//       res.sendStatus(500)
//     }
//   }
// });

// router.post("//follow", async (req, res, next) => {
//   const screenName = req.query.screen_name
//   if (!screenName) {
//     res.status(400).send("No screen name provided.")
//     return;
//   }
//   const participant = req.participant
//   try{
//     const followSuccess = await participantsService_selenium.follow(participant, screenName)
//     if(followSuccess){
//       res.sendStatus(200)
//     }
//     else{
//       res.sendStatus(500)
//     }
//   }
//   catch(e){
//     console.log("** Error in /participant/follow **")
//     console.log(e)
//     if(e.message){ 
//       res.status(502).json(e); 
//     }
//     else{ // Internal error
//       res.sendStatus(500)
//     }
//   }
// });

// router.post("//unfollow", async (req, res, next) => {
//   const screenName = req.query.screen_name
//   if (!screenName) {
//     res.status(400).send("No screen name provided.")
//     return;
//   }
//   const participant = req.participant
//   try{
//     const followSuccess = await participantsService_selenium.unfollow(participant, screenName)
//     if(followSuccess){
//       res.sendStatus(200)
//     }
//     else{
//       res.sendStatus(500)
//     }
//   }
//   catch(e){
//     console.log("** Error in /participant/unfollow **")
//     console.log(e)
//     if(e.message){ 
//       res.status(502).json(e); 
//     }
//     else{ // Internal error
//       res.sendStatus(500)
//     }
//   }
// });

// router.post("//publishTweet", async (req, res, next) => {
//   /* 
//     The tweetParams should be in the same form as in the Twiiter API.
//     See https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-update 
//     ***** Tweet which is a comment should have the property in_reply_to_status_id
//           AND include "@usernameMentioned" at the status text. *****
//     ***** Tweet which is a quote - add the parameter "attachment_url".
//           See https://stackoverflow.com/questions/29680965/how-do-i-properly-retweet-with-a-comment-via-twitters-api
//   */
//   const tweetParams = req.body
//   if (!tweetParams || !tweetParams.status) {
//     res.status(400).send("No text provided.")
//     return;
//   }
//   const participant = req.participant
//   try{
//     const publishTweetSuccess = await participantsService_selenium.publishTweet(participant, tweetParams)
//     if(publishTweetSuccess){
//       res.sendStatus(200)
//     }
//     else{
//       res.sendStatus(500)
//     }
//   }
//   catch(e){
//     console.log("** Error in /participant/publishTweet **")
//     console.log(e)
//     if(e.message){ // error thrown from the api
//       /* pay attention to e.code == 186: "Tweet needs to be a bit shorter." */
//       res.status(502).json(e); 
//     }
//     else{ // Internal error
//       res.sendStatus(500)
//     }
//   }
// });

// router.post("//publishRetweet", async (req, res, next) => {
//   const tweetId = req.query.tweetId
//   if (!tweetId) {
//     res.status(400).send("No tweet id provided.")
//     return;
//   }
//   const participant = req.participant
//   try{
//     const retweetSuccess = await participantsService_selenium.publishRetweet(participant, tweetId)
//     if(retweetSuccess){
//       res.sendStatus(200)
//     }
//     else{
//       res.sendStatus(500)
//     }
//   }
//   catch(e){
//     console.log("** Error in /participant/publishRetweet **")
//     console.log(e)
//     if(e.message){ // error thrown from the api
//       res.status(502).json(e); 
//     }
//     else{ // Internal error
//       res.sendStatus(500)
//     }
//   }
// })
module.exports = router;
