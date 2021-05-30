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
if(config.returnStaticData){ // Require them only when we need to.
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
async function getFeed(participant, maxId, count){ 
    if(config.returnStaticFeed){
        return feedJSON
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return await twitterApiGet.getFeed(T, maxId, count)
}

// Possibly add more fields
async function searchTweets(query, count=40){
    if(config.returnStaticSearchTweetsData){
        return searchTweetsJSON
    }
    //Else, call and return relevant function from the modules 
    return await twitterInnerApiGet.searchTweets(query, count)
}

// Possibly add more fields
async function searchUsers(query){
    if(config.returnStaticSearchUsersData){
        return peopleJSON
    }
    //Else, call and return relevant function from the modules
    return await twitterInnerApiGet.searchUsers(query)
}

async function getUser(username){
    // if(config.returnStaticData){
        return userJSON
    // }
    //Else, call and return relevant function from the modules
}

async function getTweet(tweetId){
    if(config.returnStaticTweetData){
        return tweetJSON
    }
    //Else, call and return relevant function from the modules
    return await twitterInnerApiGet.getTweet(tweetId)
}

async function getUserFriends(participant, username){
    if(config.returnStaticUserFriendsData){
        return friendsPeopleJSON
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return await twitterApiGet.getUserFriends(T, username)
}

async function getUserFollowers(participant, username){
    if(config.returnStaticUserFollowersData){
        return followersPeopleJSON
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return await twitterApiGet.getUserFollowers(T, username)
}

async function getUserTimeline(userId, count=40){
    if(config.returnStaticUserTimelineData){
        return userTimelineJSON
    }
    //Else, call and return relevant function from the modules
    return await twitterInnerApiGet.getUserTimeline(userId, count)
}

async function getUserTimelineFromOfficialApi(participant, userName, count=10){
    if(config.returnStaticFeed){
        return feedJSON
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return await twitterApiGet.getUserTimeline(T, userName, count)
}

async function getUserLikes(participant, username){
    if(config.returnStaticUserLikesData){
        return userLikesJSON
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return await twitterApiGet.getUserLikes(T, username)

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

async function follow(participant, screenName){ 
    if(!config.makeActionsInTwitter){
        return true
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return twitterApiPost.follow(T, screenName)
}

async function unfollow(participant, screenName){ 
    if(!config.makeActionsInTwitter){
        return true
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return twitterApiPost.unfollow(T, screenName)
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

async function publishRetweet(participant, tweetId){ 
    if(!config.publishPostInTwitter){
        return true
    }
    // Set T w/ the credentials
    setTAuth(participant.user_twitter_token, participant.user_twitter_token_secret)
    // Call and return relevant function from the modules 
    return twitterApiPost.publishRetweet(T, tweetId)
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
exports.getUserTimelineFromOfficialApi = getUserTimelineFromOfficialApi
exports.getUserLikes = getUserLikes

exports.likeTweet = likeTweet
exports.unlikeTweet = unlikeTweet
exports.follow = follow
exports.unfollow = unfollow
exports.publishTweet = publishTweet
exports.publishRetweet = publishRetweet