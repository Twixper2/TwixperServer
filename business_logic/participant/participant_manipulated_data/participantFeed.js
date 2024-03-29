const twitterComm = require("../../twitter_communicator/twitterCommunicator")
const manipulator = require("../manipulator/manipulator.js")
const database = require("../../db/DBCommunicator.js");



async function getFeed(participant, maxId, count){
    /* Check the req, if there are required paramaters missing, throw error.
       For feed, check for additional parameters like "max_id" and "count",
       and send them to twitterComm 
    */
    // Get the feed from Twitter
    let twitterFeedTweets = await twitterComm.getFeed(participant, maxId, count)
    if (twitterFeedTweets) {
        twitterFeedTweets = await manipulator.manipulateTweets(participant, twitterFeedTweets)
        return twitterFeedTweets
    }
    return null
}

exports.getFeed = getFeed