var express = require("express");
var router = express.Router();
const participantsService = require("../../service/participants/participantsService.js");
const database = require("../../business_logic/db/DBCommunicator.js")

/**
 * TODO: every function needs to pass the user to service layer, so manipulations can be applied.
 * All functions in all layers should be fixed accordinglly
 */
/* Make sure user is authenticated by checking id provided in the cookie
  and append user data from db to req
  is not authorized, respond with code 401 */
router.use(async function (req, res, next) {
  if (req.session.userTwitterToken) {
    const token = req.session.userTwitterToken;
    const participant = await database.getParticipantByToken(token);

    if (participant) {
        req.participant = participant; //every method has the user now
        next(); //go to the request
    }
    else {
      res.sendStatus(401);
    }
  }
  else {
      res.sendStatus(401); //user authentication failed, responde with unautorized
  }
});


/* ----------------------------------------
    Routes for asking for data from Twitter
   ---------------------------------------- */

router.get("/getFeed", async (req, res, next) => {
  /*
     For feed, check for additional parameters like "max_id" and "count"
  */
  const participant = req.participant

  try{
    const feedTweets = await participantsService.getFeed(participant)
    res.send(feedTweets)
  }

  catch(e){
    // Decide for error statuses by the error type.
    // For example: quota ran out, or internal error
    console.log("** Error in /participant/getFeed **")
    console.log(e)
    if(e.message){ // error thrown from the api
      res.status(502).json(e);
      /* 
      502 – The server while acting as a gateway or a proxy, 
            received an invalid response from the upstream server it accessed
            in attempting to fulfill the request.
      */
    }
    else{ // Internal error
      res.sendStatus(500)
    }
  }
});

router.get("/searchTweets", async (req, res, next) => {
  const q = req.query.q
  const participant = req.participant
  if (!q || q=="") {
    res.status(400).send("search query not provided")
  }

  try{
    const tweetsSearchResults = await participantsService.searchTweets(q, participant)
    res.send(tweetsSearchResults)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/searchUsers", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, send err status */
  const q = req.query.q
  const participant = req.participant

  if (!q || q=="") {
    res.status(400).send("search query not provided")
  }

  try{
    const usersSearchResults = await participantsService.searchUsers(q, participant)
    res.send(usersSearchResults)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUser", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const username = req.query.username
  // if username == null....

  try{
    const user = await participantsService.getUser(username)
    res.send(user)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getTweet", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const tweetId = req.query.tweetId
  // if tweetId == null....

  try{
    const tweet = await participantsService.getTweet(tweetId)
    res.send(tweet)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUserFriends", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const username = req.query.username
  // if username == null....

  try{
    const userFriends = await participantsService.getUserFriends(username)
    res.send(userFriends)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUserFollowers", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const username = req.query.username
  // if username == null....

  try{
    const userFollowers = await participantsService.getUserFollowers(username)
    res.send(userFollowers)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUserTimeline", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const username = req.query.username
  // if username == null....

  try{
    const userTimelineTweets = await participantsService.getUserTimeline(username)
    res.send(userTimelineTweets)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUserLikes", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const username = req.query.username
  // if username == null....

  try{
    const userLikesTweets = await participantsService.getUserLikes(username)
    res.send(userLikesTweets)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});


/* ----------------------------------------
    Routes for making active actions in Twitter
   ---------------------------------------- */

router.post("/likeTweet", async (req, res, next) => {
  const tweetId = req.query.tweetId
  if (!tweetId) {
    res.status(400).send("No tweet id provided.")
    return;
  }
  const participant = req.participant
  try{
    const likeSuccess = await participantsService.likeTweet(participant, tweetId)
    if(likeSuccess){
      res.sendStatus(200)
    }
    else{
      res.sendStatus(500)
    }
  }
  catch(e){
    console.log("** Error in /participant/likeTweet **")
    console.log(e)
    if(e.message){ // error thrown from the api
      // pay attention to e.code == 139: "You have already favorited this status".
      res.status(502).json(e); 
    }
    else{ // Internal error
      res.sendStatus(500)
    }
  }
});

router.post("/unlikeTweet", async (req, res, next) => {
  const tweetId = req.query.tweetId
  if (!tweetId) {
    res.status(400).send("No tweet id provided.")
    return;
  }
  const participant = req.participant
  try{
    const unlikeSuccess = await participantsService.unlikeTweet(participant, tweetId)
    if(unlikeSuccess){
      res.sendStatus(200)
    }
    else{
      res.sendStatus(500)
    }
  }
  catch(e){
    console.log("** Error in /participant/unlikeTweet **")
    console.log(e)
    if(e.message){ // error thrown from the api
      /* pay attention to e.code == 144: "No status found with that ID".
         That error code returns when the tweet is already unliked. */
      res.status(502).json(e); 
    }
    else{ // Internal error
      res.sendStatus(500)
    }
  }
});

// For new tweets and comments
router.post("/publishTweet", async (req, res, next) => {
  /* 
    The tweetParams should be in the same form as in the Twiiter API.
    See https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-update 
    ***** Tweet which is a comment should have the property in_reply_to_status_id
          AND include "@usernameMentioned" at the status text. *****
  */
  const tweetParams = req.body
  if (!tweetParams.status) {
    res.status(400).send("No text provided.")
    return;
  }
  const participant = req.participant
  try{
    const publishTweetSuccess = await participantsService.publishTweet(participant, tweetParams)
    if(publishTweetSuccess){
      res.sendStatus(200)
    }
    else{
      res.sendStatus(500)
    }
  }
  catch(e){
    console.log("** Error in /participant/publishTweet **")
    console.log(e)
    if(e.message){ // error thrown from the api
      /* pay attention to e.code == 186: "Tweet needs to be a bit shorter." */
      res.status(502).json(e); 
    }
    else{ // Internal error
      res.sendStatus(500)
    }
  }
});

module.exports = router;
