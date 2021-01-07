const twitterComm = require("../../business_logic/twitter_communicator/twitterCommunicator")
const manipulator = require("../../business_logic/manipulator/manipulator.js")

async function getFeed(){
    /* Check the req, if there are required paramaters missing, throw error.
       For feed, check for additional parameters like "max_id" and "count",
       and send them to twitterComm 
    */

    // Get the feed from Twitter
    const twitterFeedTweets = await twitterComm.getFeed()
    /* TODO: Apply manipulations */
    
    return twitterFeedTweets
}

async function searchTweets(q){
    
    const twitterSearchTweets = await twitterComm.searchTweets(q)
    /* TODO: Apply manipulations */
    
    return twitterSearchTweets
}

async function searchUsers(q){    
    
    const twitterSearchUsers = await twitterComm.searchUsers(q)
    /* TODO: Apply manipulations */
    
    return twitterSearchUsers
}

async function getUser(username){

    const twitterGetUser = await twitterComm.getUser(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUser
}

async function getTweet(tweetId){
    
    const twitterGetTweet = await twitterComm.getTweet(tweetId)
    /* TODO: Apply manipulations */
    
    return twitterGetTweet
}

async function getUserFriends(username){

    const twitterGetUserFriends = await twitterComm.getUserFriends(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserFriends
}

async function getUserFollowers(username){
    
    const twitterGetUserFollowers = await twitterComm.getUserFollowers(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserFollowers
}

async function getUserTimeline(username){

    const twitterGetUserTimeline = await twitterComm.getUserTimeline(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserTimeline
}

async function getUserLikes(username){
   
    const twitterGetUserLikes = await twitterComm.getUserLikes(username)
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