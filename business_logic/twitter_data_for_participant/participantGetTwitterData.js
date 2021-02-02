const twitterComm = require("../twitter_communicator/twitterCommunicator")
const manipulator = require("../manipulator/manipulator.js")
const database = require("../db/DBCommunicator.js");
const { data } = require("../twitter_communicator/static_twitter_data/FeedJSON");


async function getFeed(user){
    /* Check the req, if there are required paramaters missing, throw error.
       For feed, check for additional parameters like "max_id" and "count",
       and send them to twitterComm 
    */
    // Get the feed from Twitter
    let twitterFeedTweets = await twitterComm.getFeed()
    /* TODO: Apply manipulations */
    twitterFeedTweets = manipulator.manipulateTweets(user.group_manipulations, twitterFeedTweets)
    return twitterFeedTweets
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
exports.getUser = getUser
exports.getTweet = getTweet
exports.getUserFriends = getUserFriends
exports.getUserFollowers = getUserFollowers
exports.getUserTimeline = getUserTimeline
exports.getUserLikes = getUserLikes
