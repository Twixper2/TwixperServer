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
  // if (req.session && req.session.userTwitterToken) {
  if (req.header('User-Twitter-Token-Enc')) {
    // const token = req.session.userTwitterToken;
    const token = req.header('User-Twitter-Token-Enc');
    try{
      const participant = await database.getParticipantByToken(token);

      if (participant) {
        req.participant = participant; //every method has the user now
        next(); //go to the request
      }
      else {
        res.sendStatus(401);
      }
    }
    catch(e){
      console.log(e)
      res.sendStatus(500);
    }
  }
  else {
    res.status(428).send("Missing auth header User-Twitter-Token-Enc"); 
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
  if(!participantsService.validateActionsFields(actionsToLog)){
    res.sendStatus(400).send("invalid actions format"); // Bad request
  }

  const participant = req.participant
  participantsService.logParticipantActions(participant, actionsToLog)

  res.sendStatus(200)
});

/* ----------------------------------------
    Routes for asking for data from Twitter
   ---------------------------------------- */

router.get("/getFeed", async (req, res, next) => {
  /*
     For feed, check for additional parameters like "max_id" and "count"
  */
  const participant = req.participant
  const maxId = req.query.maxId
  const count = req.query.count

  try{
    const feedTweets = await participantsService.getFeed(participant, maxId, count)
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
  if (!q || q=="") {
    res.status(400).send("search query not provided")
    return
  }
  try{
    const tweetsSearchResults = await participantsService.searchTweets(q)
    res.send(tweetsSearchResults)
  }
  catch(e){
    console.log(e)
    if(e.message == "inner-api-error"){ // error thrown from the api
      res.status(502).json(e);
    }
    else{
      res.sendStatus(500)
    }
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
  if (!tweetId) {
    res.status(400).send("No tweet id provided.")
    return;
  }
  try{
    const tweet = await participantsService.getTweet(tweetId)
    res.send(tweet)
  }
  catch(e){
    console.log(e)
    if(e.message == "inner-api-error"){ // error thrown from the api
      res.status(502).json(e);
    }
    else{
      res.sendStatus(500)
    }
  }
});

router.get("/getUserFriends", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const username = req.query.username
  if (!username) {
    res.status(400).send("No username provided.")
    return;
  }
  const participant = req.participant
  try{
    const userFriends = await participantsService.getUserFriends(participant, username)
    res.send(userFriends)
  }
  catch(e){
    console.log("** Error in /participant/userFriends **")
    console.log(e)
    if(e.message){ // error thrown from the api
      res.status(502).json(e); 
    }
    else{ // Internal error
      res.sendStatus(500)
    }
  }
});

router.get("/getUserFollowers", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const username = req.query.username
  if (!username) {
    res.status(400).send("No username provided.")
    return;
  }
  const participant = req.participant
  try{
    const userFollowers = await participantsService.getUserFollowers(participant, username)
    res.send(userFollowers)
  }
  catch(e){
    console.log("** Error in /participant/getUserFollowers **")
    console.log(e)
    if(e.message){ // error thrown from the api
      res.status(502).json(e); 
    }
    else{ // Internal error
      res.sendStatus(500)
    }
  }
});

router.get("/getUserTimeline", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const userId = req.query.userId
  if (!userId) {
    res.status(400).send("No user id provided.")
    return;
  }
  try{
    const userTimelineTweets = await participantsService.getUserTimeline(userId)
    res.send(userTimelineTweets)
  }
  catch(e){
    console.log(e)
    if(e.message == "inner-api-error"){ // error thrown from the api
      res.status(502).json(e);
    }
    else{
      res.sendStatus(500)
    }
  }
});

router.get("/getUserLikes", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error */
  const username = req.query.username
  if (!username) {
    res.status(400).send("No username provided.")
    return;
  }
  const participant = req.participant
  try{
    const userLikesTweets = await participantsService.getUserLikes(participant, username)
    res.send(userLikesTweets)
  }
  catch(e){
    console.log("** Error in /participant/getUserLikes **")
    console.log(e)
    if(e.message){ // error thrown from the api
      res.status(502).json(e); 
    }
    else{ // Internal error
      res.sendStatus(500)
    }
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
    ***** Tweet which is a quote - add the parameter "attachment_url".
          See https://stackoverflow.com/questions/29680965/how-do-i-properly-retweet-with-a-comment-via-twitters-api
  */
  const tweetParams = req.body
  if (!tweetParams || !tweetParams.status) {
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

router.post("/publishRetweet", async (req, res, next) => {
  const tweetId = req.query.tweetId
  if (!tweetId) {
    res.status(400).send("No tweet id provided.")
    return;
  }
  const participant = req.participant
  try{
    const retweetSuccess = await participantsService.publishRetweet(participant, tweetId)
    if(retweetSuccess){
      res.sendStatus(200)
    }
    else{
      res.sendStatus(500)
    }
  }
  catch(e){
    console.log("** Error in /participant/publishRetweet **")
    console.log(e)
    if(e.message){ // error thrown from the api
      res.status(502).json(e); 
    }
    else{ // Internal error
      res.sendStatus(500)
    }
  }
})


/* ----------------------------------------
    Routes for other resources
   ---------------------------------------- */

router.post("/getLinkPreview", async (req, res, next) => {
  const previewUrl = req.body.url
  if (!previewUrl) {
    res.status(400).send("No url provided.")
    return;
  }
  try{
    const metaTagData = await participantsService.getLinkPreview(previewUrl)
    res.send(metaTagData)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});
module.exports = router;
