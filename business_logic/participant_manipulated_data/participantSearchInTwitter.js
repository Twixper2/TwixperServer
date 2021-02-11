const twitterComm = require("../twitter_communicator/twitterCommunicator")
const manipulator = require("../manipulator/manipulator.js")
const database = require("../db/DBCommunicator.js");
const { data } = require("../twitter_communicator/static_twitter_data/FeedJSON");

async function searchTweets(q, participant){
    let results = await twitterComm.searchTweets(q)
    if (results) {
        results = manipulator.manipulateTweets(participant.group_manipulations, twitterFeedTweets)
        return results
    }
    return null
}

async function searchUsers(q){    
    let results = await twitterComm.searchUsers(q)
    /** Manipulate? */
    if (results) {
        return results
    }
    return null
}

exports.searchTweets = searchTweets
exports.searchUsers = searchUsers
