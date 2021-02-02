const twitterComm = require("../twitter_communicator/twitterCommunicator")
const manipulator = require("../manipulator/manipulator.js")
const database = require("../db/DBCommunicator.js");
const { data } = require("../twitter_communicator/static_twitter_data/FeedJSON");

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

exports.searchTweets = searchTweets
exports.searchUsers = searchUsers