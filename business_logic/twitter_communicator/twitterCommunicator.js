/*
    All twitter api request should go to here.
    Requires the modules in folders "twitter_api_get" and "twitter_api_post",
    and calling their functions to return the data.
*/

const returnStaticData = true

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

// Possibly add more fields such as "max_id" and "count"
function getFeed(){ 
    if(returnStaticData){
        return feedJSON
    }
    //Else, call and return relevant function from the modules 
}

// Possibly add more fields
function searchTweets(query){
    if(returnStaticData){
        return searchTweetsJSON
    }
    //Else, call and return relevant function from the modules 
}

// Possibly add more fields
function searchUsers(query){
    if(returnStaticData){
        return peopleJSON
    }
    //Else, call and return relevant function from the modules
}

function getUser(username){
    if(returnStaticData){
        return userPageJSON
    }
    //Else, call and return relevant function from the modules
}

function getTweet(tweetId){
    if(returnStaticData){
        return tweetPageJSON
    }
    //Else, call and return relevant function from the modules
}

function getUserFriends(username){
    if(returnStaticData){
        return friendsPeopleJSON
    }
    //Else, call and return relevant function from the modules
}

function getUserFollowers(username){
    if(returnStaticData){
        return followersPeopleJSON
    }
    //Else, call and return relevant function from the modules
}

function getUserTimeline(username){
    if(returnStaticData){
        return userTimelineJSON
    }
    //Else, call and return relevant function from the modules
}

function getUserLikes(username){
    if(returnStaticData){
        return userLikesJSON
    }
    //Else, call and return relevant function from the modules
}

exports.getFeed = getFeed
exports.searchTweets = searchTweets
exports.searchUsers = searchUsers
exports.getUser = getUser
exports.getTweet = getTweet
exports.getUserFriends = getUserFriends
exports.getUserFollowers = getUserFollowers
exports.getUserTimeline = getUserTimeline
exports.getUserLikes = getUserLikes
