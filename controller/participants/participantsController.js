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
  is there's a problem, respond with code 401 */
router.use(async function (req, res, next) {
  if (req.cookies &&  req.cookies.userTwitterToken) {
    const token = req.cookies.userTwitterToken;
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
    console.log(e)
    res.sendStatus(500)
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

module.exports = router;
