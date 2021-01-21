var express = require("express");
var router = express.Router();
const participantsService = require("../../service/participants/participantsService.js");
const database = require("../../business_logic/db/DBCommunicator.js")


/* Make sure user is authenticated by checking id provided in the cookie
  and append user data from db to req
  is there's a problem, respond with code 401 */
router.use(async function (req, res, next) {
  if (req.session &&  req.session.id) {
    const id = req.session.id;
    const user = await checkIdOnDb(id);

    if (user) {
        req.user = user; //every method has the user now
        next(); //go to the request
    }
  }
  else {
      res.sendStatus(401); //user authentication failed, responde with unautorized
  }
});


router.get("/getFeed", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error.
     For feed, check for additional parameters like "max_id" and "count"
  */
 const user = {
    "exp_id": "1546515611",
    "group_id": 12,
    "participant_twitter_id": 99999,
    "user_twitter_token": "456",
    "participant_twitter_username": "Nir",
    "group_manipulations": [
      {
          "type":'mute',
          "users": ['realDonaldTrump']
      }
    ]
  }
  try{
    const feedTweets = await participantsService.getFeed(user)
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
  /* Check the req, if there are required paramaters missing, send err status */
  // const user = 

  const q = req.query.q
  console.log("Seacrch Tweets query is "+ q)
  // if q == null....

  try{
    const tweetsSearchResults = await participantsService.searchTweets(q)
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
  // if q == null....

  try{
    const usersSearchResults = await participantsService.searchUsers(q)
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

async function checkIdOnDb(id) {
  //should give id and username
  return await database.getParticipant(id); 
}

module.exports = router;
