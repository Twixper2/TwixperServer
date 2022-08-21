var express = require("express");
var router = express.Router();
const { tabsHashMap } = require("../../config");
const participantsService_selenium = require("../../service/participants/participantsService_selenium.js");
const database = require("../../business_logic/db/DBCommunicator.js");

var searchMode = "";

/* Make sure user is authenticated by checking if tab is active
  is not authorized, respond with code 401 */
router.use(async function (req, res, next) {
  try{
    const header_params = req.headers
    const access_token = header_params.accesstoken;
    const user = header_params.user;
    if(!header_params || !access_token || !user){
      res.status(400).send("No access_token or user params supplied in Header.")
      return
    }
    let entity_details = tabsHashMap.get(access_token);
    if(tabsHashMap.size == 0 || entity_details == undefined || entity_details.user !== user){
      res.status(401).send("This user is not authenticated.");
      return
    }
    let participant = await database.getParticipantByUsername(header_params.user);
    // continute only if participant is under exp'
    if (participant) { 
      req.server_sends_access_token = access_token;
      req.server_sends_tab = entity_details.tab;
      req.user = header_params.user;
      req.participant = participant;
      next();
    }
    else{
      res.status(401).send("This user is not connected to a exp.");
    }
  }
  catch(e){
    res.sendStatus(500);
  }
});

/* ----------------------------------------
    Routes for asking for data from Twitter
   ---------------------------------------- */
router.get("/getWhoToFollow", async (req, res, next) => {
  let tab = req.server_sends_tab;
  let access_token = req.server_sends_access_token;
  try{
    const whoToFollowElement = await participantsService_selenium.getWhoToFollow(null,tab);
    if(whoToFollowElement == null || whoToFollowElement.length === 0){
      res.status(400).send('an error has occurred.');
      return;
    }
    res.status(200).send(whoToFollowElement);
    return;
  }
  catch(e){
    console.log(e)
    // Chrome is not reachable, remove tab from hashmap
    if(e.name == "WebDriverError"){
      tabsHashMap.delete(access_token);
      res.status(502).json("Tab is closed for some reason. Please authenticate again.")
      return;
    }
    else{ // Internal error
      res.sendStatus(500)
      return;
    }
  }
});

router.get("/getFeed", async (req, res, next) => {
  let tab = req.server_sends_tab;
  let access_token = req.server_sends_access_token;
  try{
    let params = {participant: req.participant};
    if(!params){
      res.status(400).json("participant from db is missing.")
    }
    const getFeed = await participantsService_selenium.getFeed(params,tab);
    if(getFeed == null || getFeed.length === 0){
      res.status(400).send('an error has occurred.');
      return;
    }
    res.status(200).send(getFeed);
  }
  catch(e){
    console.log(e)
    // Chrome is not reachable, remove tab from hashmap
    if(e.name == "WebDriverError"){
      tabsHashMap.delete(access_token);
      res.status(502).json("Tab is closed for some reason. Please authenticate again.")
      return
    }
    else{ // Internal error
      res.sendStatus(500)
      return;
    }
  }
});

router.get("/getTweet", async (req, res, next) => {
  let tab = req.server_sends_tab;
  let access_token = req.server_sends_access_token;
  try{
    let params = req.query;
    if(!params.tweetIdStr || !params.tweetUser){
      res.status(400).json("tweetIdStr or user or tweetUser fields are missing.")
    }
    const getTweet = await participantsService_selenium.getTweet(params,tab);
    if(!getTweet){
      res.status(400).send('an error has occurred.');
      return;
    }
    res.status(200).send(getTweet); 
  }
  catch(e){
    console.log(e)
    // Chrome is not reachable, remove tab from hashmap
    if(e.name == "WebDriverError"){
      tabsHashMap.delete(access_token);
      res.status(502).json("Tab is closed for some reason. Please authenticate again.")
      return
    }
    else{ // Internal error
      res.sendStatus(500)
      return;
    }
  }
});

router.get("/getUserEntityDetails", async (req, res, next) => {
  let tab = req.server_sends_tab;
  let access_token = req.server_sends_access_token;
  try{
    let params = req.query;
    if(!params.req_user){
      res.status(400).json("user field is empty.");
      return;
    }
    const getUserEntityDetails = await participantsService_selenium.getUserEntityDetails(params,tab);
    if(!getUserEntityDetails){
      res.status(400).send('an error has occurred.');
      return;
    }
    // Add also Tweets & Likes tab
    res.status(200).send(getUserEntityDetails);
  }
  catch(e){
    console.log(e)
    // Chrome is not reachable, remove tab from hashmap
    if(e.name == "WebDriverError"){
      tabsHashMap.delete(access_token);
      res.status(502).json("Tab is closed for some reason. Please authenticate again.")
      return
    }
    else{ // Internal error
      res.sendStatus(500)
      return;
    }
  }
});

router.get("/getUserTimeline", async (req, res, next) => {
  let tab = req.server_sends_tab;
  let access_token = req.server_sends_access_token;
  try{
    let params = req.query;
    if(!params.req_user){
      res.status(400).json("user field is empty.")
    }
    const getUserTimeline = await participantsService_selenium.getUserTimeline(params,tab);
    if(!getUserTimeline || getUserTimeline.length === 0){
      res.status(400).send('an error has occurred.');
      return;
    }
    // Add also Tweets & Likes tab
    res.status(200).send(getUserTimeline);
  }
  catch(e){
    console.log(e)
    // Chrome is not reachable, remove tab from hashmap
    if(e.name == "WebDriverError"){
      tabsHashMap.delete(access_token);
      res.status(502).json("Tab is closed for some reason. Please authenticate again.")
      return
    }
    else{ // Internal error
      res.sendStatus(500)
      return;
    }
  }
});

router.get("/getUserLikes", async (req, res, next) => {
  let tab = req.server_sends_tab;
  let access_token = req.server_sends_access_token;
  try{
    let params = req.query;
    if(!params.req_user){
      res.status(400).json("user field is empty.")
    }
    const getUserLikes = await participantsService_selenium.getUserLikes(params,tab);
    if(!getUserLikes || getUserLikes.length === 0){
      res.status(400).send('an error has occurred.');
      return;
    }
    // Add also Tweets & Likes tab
    res.status(200).send(getUserLikes);
  }
  catch(e){
    console.log(e)
    // Chrome is not reachable, remove tab from hashmap
    if(e.name == "WebDriverError"){
      tabsHashMap.delete(access_token);
      res.status(502).json("Tab is closed for some reason. Please authenticate again.")
      return
    }
    else{ // Internal error
      res.sendStatus(500)
      return;
    }
  }
});

//old searchTweets
// router.get("/searchTweets", async (req, res, next) => {
//   const q = req.query.query
//   if (!q || q=="") {
//     res.status(400).send("search query not provided")
//     return
//   }
//   try{
//     const tweetsSearchResults = await participantsService_selenium.searchTweets(req.server_sends_tab, q)
//     res.send(tweetsSearchResults)
//   }
//   catch(e){
//     console.log(e)
//     if(e.message == "search-tweets-error"){ // error thrown from the api
//       res.status(502).json(e);
//     }
//     else{
//       res.sendStatus(500)
//     }
//   }
// });

// router.get("/searchPeople", async (req, res, next) => {
//   const q = req.query.query
//   if (!q || q=="") {
//     res.status(400).send("search query not provided")
//     return
//   }
//   try{
//     const PeopleSearchResults = await participantsService_selenium.searchPeople(req.server_sends_tab, q)
//     res.send(PeopleSearchResults)
//   }
//   catch(e){
//     console.log(e)
//     if(e.message == "search-people-error"){ // error thrown from the api
//       res.status(502).json(e);
//     }
//     else{
//       res.sendStatus(500)
//     }
//   }
// });
/*-------------------*/


router.get("/closeSearchTab", async (req, res, next) => {
  //Checks if there are any other tabs open
  if ((await req.server_sends_tab.getAllWindowHandles()).length != 2) {
    res.status(400).send("Search page does not exist, try opening a new search")
    return
  }
  try{
    const tweetsSearchResults = await participantsService_selenium.closeSecondTab(req.server_sends_tab)
    res.send(tweetsSearchResults)
  }
  catch(e){
    console.log(e)
    if(e.message == "search-tweets-error"){ // error thrown from the api
      res.status(502).json(e);
    }
    else{
      res.sendStatus(500)
    }
  }
});

router.get("/search/:searchMode", async (req, res, next) => {

  const q = req.query?.query;

  // searchMode - tweets or people
  const mode = req.params?.searchMode;

  if (!q || q==""|| mode=="") {
    res.status(400).send("search query not provided")
    return
  }
  try{
    //According to the search parameter received by a search operation
    if(mode == "tweets"){
      const tweetsSearchResults = await participantsService_selenium.newTweetsSearch(req.server_sends_tab, q)
      res.send(tweetsSearchResults)
    }
    else if(mode == "people"){
      const tweetsSearchResults = await participantsService_selenium.newPeopleSearch(req.server_sends_tab, q)
      res.send(tweetsSearchResults)
    }
    else{
      res.status(400).send("search mode not provided")
      return
    }

  }
  catch(e){
    console.log(e)
    if(e.message == "search-tweets-error"){ // error thrown from the api
      res.status(502).json(e);
    }
    else{
      res.sendStatus(500)
    }
  }
});

router.get("/search/getMoreSearchResult/:searchMode", async (req, res, next) => {
  const mode = req.params?.searchMode;
  //Checks if there are any other tabs open
  if ((await req.server_sends_tab.getAllWindowHandles()).length != 2) {
    res.status(400).send("Search page does not exist, try opening a new search")
    return
  }
  try{
    if(mode == "tweets" || mode =="people"){
      const tweetsSearchResults = await participantsService_selenium.getMoreSearchResult(req.server_sends_tab, mode)
      res.send(tweetsSearchResults)
    }
    else{
      res.status(400).send("search mode is not provided")
      return
    }

  }
  catch(e){
    console.log(e)
    if(e.message == "search-tweets-error"){ // error thrown from the api
      res.status(502).json(e);
    }
    else{
      res.sendStatus(500)
    }
  }
});

router.get("/notifications", async (req, res, next) => {
  try{
    const tweetsSearchResults = await participantsService_selenium.getNotifications(req.server_sends_tab)
    res.send(tweetsSearchResults)
  }
  catch(e){
    console.log(e)
    if(e.message == "search-tweets-error"){ // error thrown from the api
      res.status(502).json(e);
    }
    else{
      res.sendStatus(500)
    }
  }
});

router.post("/addAction/:action", async (req, res, next) => {
  
  try{
    const action      = req.params?.action;
    const tweet_id    = req?.body?.tweetIdStr;
    const screen_name = req?.body?.tweetUser;
    const reply       = req?.body?.reply;
    const ShareVia    = req?.body?.ShareVia;

    if(tweet_id==undefined || screen_name == undefined || action == undefined){
      res.status(400).send("one or more of action params is not provided")
    }

    if(action == "like" || action =="retweet" || action =="reply"){
      const tweetsSearchResults = await participantsService_selenium.tweetsAction(req.server_sends_tab,tweet_id,screen_name,action,reply,ShareVia);
      res.send(tweetsSearchResults)
    }
    else{
      res.status(400).send("action is not provided")
      return
    }

  }
  catch(e){
    console.log(e)
    if(e.message == "add-action-error"){ 
      res.status(502).json(e);
    }
    else{
      res.sendStatus(500)
    }
  }
});

// For new tweets and comments
router.post("/postTweet", async (req, res, next) => {

  const tweetContext = req?.body?.tweetContext;
  if (!tweetContext) {
    res.status(400).send("No tweet Context was provided.")
    return;
  }
  try{
    const publishTweetSuccess = await participantsService_selenium.postTweet(req.server_sends_tab,tweetContext);
    if(publishTweetSuccess){
      res.sendStatus(200)
    }
    else{
      res.status(400).send("Whoops! You already said that")
    }
  }
  catch(e){
    console.log("** Error in /participant/postTweet **")
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




/*
Need to implement the endpoints below
*/

/* ----------------------------------------
    Routes for logging actions
   ---------------------------------------- */
  //  router.post("/sendActions", async (req, res, next) => {
  //   const actionsToLog = req.body
  //   if (!actionsToLog) {
  //     res.status(400).send("no actions provided")
  //   }
  //   if(!participantsService_selenium.validateActionsFields(actionsToLog)){
  //     res.sendStatus(400).send("invalid actions format"); // Bad request
  //   }
  
  //   const participant = req.participant
  //   participantsService.logParticipantActions(participant, actionsToLog)
  
  //   res.sendStatus(200)
  // });

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
