const twitterComm = require("../twitter_communicator/twitterCommunicator")
const manipulator = require("../manipulator/manipulator.js")
const database = require("../db/DBCommunicator.js");



async function getFeed(participant){
    /* Check the req, if there are required paramaters missing, throw error.
       For feed, check for additional parameters like "max_id" and "count",
       and send them to twitterComm 
    */
    // Get the feed from Twitter
    let twitterFeedTweets = await twitterComm.getFeed(participant)
    if (twitterFeedTweets) {
        twitterFeedTweets = manipulator.manipulateTweets(participant.group_manipulations, twitterFeedTweets)
        return twitterFeedTweets
    }
    return null
}

exports.getFeed = getFeed