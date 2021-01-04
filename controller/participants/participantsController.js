var express = require("express");
var router = express.Router();
const participantsService = require("../../service/participants/participantsService.js");

// access control , checking cookie 
// router.use(function (req, res, next) {
    // Check for authentication from Twitter, 
    // and check that this user is in active experiment.

    /*if (req.session && req.session.user_id) {
      DButils.execQuery("SELECT user_id FROM users")
        .then((users) => {
          if (users.find((x) => x.user_id === req.session.user_id)) {
            req.user_id = req.session.user_id;
            next();
          }
          else throw { status: 401, message: "unauthorized" };
        })
        .catch((error) => res.send(error));
    } else {
      res.sendStatus(401);
    }*/
// });

router.get("/getFeed", async (req, res, next) => {
  /* Check the req, if there are required paramaters missing, throw error.
     For feed, check for additional parameters like "max_id" and "count"
  */
  try{
    const feedTweets = participantsService.getFeed()
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
  const q = req.query.q
  console.log("Seacrch Tweets query is "+ q)
  // if q == null....

  try{
    const tweetsSearchResults = participantsService.searchTweets(q)
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
    const usersSearchResults = participantsService.searchUsers(q)
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
    const user = participantsService.getUser(username)
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
    const tweet = participantsService.getTweet(tweetId)
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
    const userFriends = participantsService.getUserFriends(username)
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
    const userFollowers = participantsService.getUserFollowers(username)
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
    const userTimelineTweets = participantsService.getUserTimeline(username)
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
    const userLikesTweets = participantsService.getUserLikes(username)
    res.send(userLikesTweets)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.use((req,res) => {
  res.sendStatus(404);
});

module.exports = router;
