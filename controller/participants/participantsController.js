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
  try{
    const feedTweets = participantsService.getFeed(req)
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
  try{
    const tweetsSearchResults = participantsService.searchTweets(req)
    res.send(tweetsSearchResults)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/searchUsers", async (req, res, next) => {
  try{
    const usersSearchResults = participantsService.searchUsers(req)
    res.send(usersSearchResults)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUser", async (req, res, next) => {
  try{
    const user = participantsService.getUser(req)
    res.send(user)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getTweet", async (req, res, next) => {
  try{
    const tweet = participantsService.getTweet(req)
    res.send(tweet)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUserFriends", async (req, res, next) => {
  try{
    const userFriends = participantsService.getUserFriends(req)
    res.send(userFriends)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUserFollowers", async (req, res, next) => {
  try{
    const userFollowers = participantsService.getUserFollowers(req)
    res.send(userFollowers)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUserTimeline", async (req, res, next) => {
  try{
    const userTimelineTweets = participantsService.getUserTimeline(req)
    res.send(userTimelineTweets)
  }
  catch(e){
    console.log(e)
    res.sendStatus(500)
  }
});

router.get("/getUserLikes", async (req, res, next) => {
  try{
    const userLikesTweets = participantsService.getUserLikes(req)
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
