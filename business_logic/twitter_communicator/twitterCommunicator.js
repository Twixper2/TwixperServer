/*
    All twitter api request should go to here.
    Requires the modules in folders "twitter_api_get" and "twitter_api_post",
    and calls their functions to return the data.
*/
const twitterApiGet = require("./twitter_api_get/twitterApiGet");
const twitterApiPost = require("./twitter_api_post/twitterApiPost");
const twitterAxiosRequests = require("./twitter_axios_requests/twitterAxiosRequests")
const twitterInnerApiGet = require("./twitter_internal_api/twitterInnerApiGet")

// var config = require.main.require('./config.js')
const config = require('../../config.js')

/* T Object*/
var Twit = require('twit')
var T = new Twit({
  consumer_key:         process.env.API_KEY,
  consumer_secret:      process.env.API_SECRET_KEY,
  access_token:         '...',
  access_token_secret:  '...',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//   strictSSL:            true,     // optional - requires SSL certificates to be valid.
})
function setTAuth(token, tokenSecret){
    T.setAuth({
        access_token: token,
        access_token_secret: tokenSecret
    })
}

/* Configurations */
const returnStaticData = config.returnStaticData
const returnStaticTweetData = config.returnStaticTweetData

/* For static data */
var feedJSON = []
var peopleJSON = []
var friendsPeopleJSON = []
var followersPeopleJSON = []
var searchTweetsJSON = []
var userJSON = {}
var tweetJSON = {}
var userTimelineJSON = []
var userLikesJSON = []
if(returnStaticData){ // Require them only when we need to.
    feedJSON = require("./static_twitter_data/FeedJSON.js").data
    peopleJSON = require("./static_twitter_data/SearchPeopleJSON").data
    friendsPeopleJSON = require("./static_twitter_data/FriendsPeopleJSON.js").data
    followersPeopleJSON = require("./static_twitter_data/FollowersPeopleJSON.js").data
    searchTweetsJSON = require("./static_twitter_data/SearchTweetsJSON.js").data
    userJSON = require("./static_twitter_data/UserPageJSON.js").data
    tweetJSON = require("./static_twitter_data/TweetPageJSON.js").data
    userTimelineJSON = require("./static_twitter_data/UserTimelineJSON.js").data
    userLikesJSON = require("./static_twitter_data/UserLikesJSON.js").data
}
/* End of static data */

/**
 * returns full user data
 * @param {*} userTwitterToken 
 * @param {*} userTwitterTokenSecret 
 */
async function verifyCredentials(userTwitterToken, userTwitterTokenSecret){
    if(!config.realVerifyCredentials){
        return {id_str: "123456789", screen_name: "nirdz"}
    }
    // Set T w/ the credentials
    setTAuth(userTwitterToken, userTwitterTokenSecret)
    // Call and return relevant function from the modules 
    return twitterApiGet.verifyCredentials(T)
}

async function getTwitterRequestToken(oathCallback){
    if(!config.realVerifyCredentials){
        throw "can only work in real mode"
    }
    return twitterAxiosRequests.requestToken(oathCallback)
}

async function getTwitterAccesssToken(token, verifier){
    if(!config.realVerifyCredentials){
        throw "can only work in real mode"
    }
    return twitterAxiosRequests.accessToken(token, verifier)
}


/* ----------------------------------------
    Asking data from Twitter
   ---------------------------------------- */

// Possibly add more fields such as "max_id" and "count"
async function getFeed(participant  ){ 
    if(config.returnStaticFeed){
        return feedJSON
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return await twitterApiGet.getFeed(T)
}

// Possibly add more fields
async function searchTweets(query){
    if(returnStaticData){
        return searchTweetsJSON
    }
    //Else, call and return relevant function from the modules 
}

// Possibly add more fields
async function searchUsers(query){
    if(returnStaticData){
        return peopleJSON
    }
    //Else, call and return relevant function from the modules
}

async function getUser(username){
    if(returnStaticData){
        return userJSON
    }
    //Else, call and return relevant function from the modules
}

async function getTweet(tweetId){
    if(returnStaticTweetData){
        return tweetJSON
    }
    //Else, call and return relevant function from the modules
    return await twitterInnerApiGet.getTweet(tweetId)
}

async function getUserFriends(username){
    if(returnStaticData){
        return friendsPeopleJSON
    }
    //Else, call and return relevant function from the modules
}

async function getUserFollowers(username){
    if(returnStaticData){
        return followersPeopleJSON
    }
    //Else, call and return relevant function from the modules
}

async function getUserTimeline(username){
    if(returnStaticData){
        return userTimelineJSON
    }
    //Else, call and return relevant function from the modules
}

async function getUserLikes(username){
    if(returnStaticData){
        return userLikesJSON
    }
    //Else, set T w/ the credentials, call and return relevant function from the modules
}



/* ----------------------------------------
    Make active actions in Twitter
   ---------------------------------------- */

async function likeTweet(participant, tweetId){ 
    if(!config.makeActionsInTwitter){
        return true
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return twitterApiPost.likeTweet(T, tweetId)
}   

async function unlikeTweet(participant, tweetId){ 
    if(!config.makeActionsInTwitter){
        return true
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return twitterApiPost.unlikeTweet(T, tweetId)
}  

async function publishTweet(participant, tweetParams){ 
    if(!config.publishPostInTwitter){
        return true
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return twitterApiPost.publishTweet(T, tweetParams)
}  

exports.getTwitterRequestToken = getTwitterRequestToken
exports.getTwitterAccesssToken = getTwitterAccesssToken
exports.verifyCredentials = verifyCredentials
exports.getFeed = getFeed
exports.searchTweets = searchTweets
exports.searchUsers = searchUsers
exports.getUser = getUser
exports.getTweet = getTweet
exports.getUserFriends = getUserFriends
exports.getUserFollowers = getUserFollowers
exports.getUserTimeline = getUserTimeline
exports.getUserLikes = getUserLikes

exports.likeTweet = likeTweet
exports.unlikeTweet = unlikeTweet
exports.publishTweet = publishTweet