const twitterComm = require("../../business_logic/twitter_communicator/twitterCommunicator")
const manipulator = require("../../business_logic/manipulator/manipulator.js")

function getFeed(){
    /* Check the req, if there are required paramaters missing, throw error.
       For feed, check for additional parameters like "max_id" and "count",
       and send them to twitterComm 
    */

    // Get the feed from Twitter
    const twitterFeedTweets = twitterComm.getFeed()
    /* TODO: Apply manipulations */
    
    return twitterFeedTweets
}

function searchTweets(q){
    
    const twitterSearchTweets = twitterComm.searchTweets(q)
    /* TODO: Apply manipulations */
    
    return twitterSearchTweets
}

function searchUsers(q){    
    
    const twitterSearchUsers = twitterComm.searchUsers(q)
    /* TODO: Apply manipulations */
    
    return twitterSearchUsers
}

function getUser(username){

    const twitterGetUser = twitterComm.getUser(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUser
}

function getTweet(tweetId){
    
    const twitterGetTweet = twitterComm.getTweet(tweetId)
    /* TODO: Apply manipulations */
    
    return twitterGetTweet
}

function getUserFriends(username){

    const twitterGetUserFriends = twitterComm.getUserFriends(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserFriends
}

function getUserFollowers(username){
    
    const twitterGetUserFollowers = twitterComm.getUserFollowers(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserFollowers
}

function getUserTimeline(username){

    const twitterGetUserTimeline = twitterComm.getUserTimeline(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserTimeline
}

function getUserLikes(username){
   
    const twitterGetUserLikes = twitterComm.getUserLikes(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserLikes
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