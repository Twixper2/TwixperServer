const twitterComm = require("../../business_logic/twitter_communicator/twitterCommunicator")
const manipulator = require("../../business_logic/manipulator/manipulator.js")

function getFeed(req){
    /* Check the req, if there are required paramaters missing, throw error.
       For feed, check for additional parameters like "max_id" and "count",
       and send them to twitterComm 
    */

    // Get the feed from Twitter
    const twitterFeedTweets = twitterComm.getFeed()
    /* TODO: Apply manipulations */
    
    return twitterFeedTweets
}

function searchTweets(req){
    /* Check the req, if there are required paramaters missing, throw error */
    const q = req.query.q
    console.log("Seacrch Tweets query is "+ q)
    // if q == null....

    const twitterSearchTweets = twitterComm.searchTweets(q)
    /* TODO: Apply manipulations */
    
    return twitterSearchTweets
}

function searchUsers(req){
    /* Check the req, if there are required paramaters missing, throw error */
    const q = req.query.q
    // if q == null....

    const twitterSearchUsers = twitterComm.searchUsers(q)
    /* TODO: Apply manipulations */
    
    return twitterSearchUsers
}

function getUser(req){
    /* Check the req, if there are required paramaters missing, throw error */
    const username = req.query.username
    // if username == null....

    const twitterGetUser = twitterComm.getUser(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUser
}

function getTweet(req){
    /* Check the req, if there are required paramaters missing, throw error */
    const tweetId = req.query.tweetId
    // if tweetId == null....

    const twitterGetTweet = twitterComm.getTweet(tweetId)
    /* TODO: Apply manipulations */
    
    return twitterGetTweet
}

function getUserFriends(req){
    /* Check the req, if there are required paramaters missing, throw error */
    const username = req.query.username
    // if username == null....

    const twitterGetUserFriends = twitterComm.getUserFriends(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserFriends
}

function getUserFollowers(req){
    /* Check the req, if there are required paramaters missing, throw error */
    const username = req.query.username
    // if username == null....

    const twitterGetUserFollowers = twitterComm.getUserFollowers(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserFollowers
}

function getUserTimeline(req){
    /* Check the req, if there are required paramaters missing, throw error */
    const username = req.query.username
    // if username == null....

    const twitterGetUserTimeline = twitterComm.getUserTimeline(username)
    /* TODO: Apply manipulations */
    
    return twitterGetUserTimeline
}

function getUserLikes(req){
    /* Check the req, if there are required paramaters missing, throw error */
    const username = req.query.username
    // if username == null....

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