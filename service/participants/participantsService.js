const twitterComm = require("../../business_logic/twitter_communicator/twitterCommunicator")
const manipulator = require("../../business_logic/manipulator/manipulator.js")
const database = require("../../business_logic/db/DBCommunicator.js");
const { data } = require("../../business_logic/twitter_communicator/static_twitter_data/FeedJSON");


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

/**
 * get experiment from db, deside group for praticipant, put inside the participant the data needed from experiment (group's manipulations) and add user to db
 * @param {*} userTwitterToken 
 * @param {*} expId 
 */
async function registerParticipant(userTwitterToken, expId) {
    const experiment = await database.getExperimentById(expId);
    const expGroups = experiment.exp_groups;
    // raffle group for user, after hackathon do it using another file 
    let groupId = -1
    let username = ""
    if (userTwitterToken = "123"){
        const groupId = 11
        username = "Nir"
    }
    else if (userTwitterToken = "456"){
        const groupId = 12
        username = "Tal"

    }
    else{
        const groupId = 12
        username = "Dekel"
    }

    // find exp group by groupId within experiment 
    const group = exp_groups.filter(obj => {
        return obj.group_id == groupId
    })[0]

    let user = {
        "exp_id": expId,
        "group_id": group.group_id,
        "participant_twitter_id" : 99999,
        "user_twitter_token" : userTwitterToken,
        "participant_twitter_username": username,
        "group_manipulations": group.group_manipulations
    }
    
    database.insertParticipant(user)

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