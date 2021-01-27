const twitterComm = require("../../business_logic/twitter_communicator/twitterCommunicator")
const manipulator = require("../../business_logic/manipulator/manipulator.js")
const database = require("../../business_logic/db/DBCommunicator.js");
const { data } = require("../../business_logic/twitter_communicator/static_twitter_data/FeedJSON");

/**
 * return user twitter id if found, else null
 * @param {*} userTwitterToken 
 * @param {*} userTwitterTokenSecret 
 */
async function getTwitterIdFromTokens(userTwitterToken, userTwitterTokenSecret) {
    let userData =  await twitterComm.verifyCredentials(userTwitterToken,userTwitterTokenSecret)
    if (!userData || !userData.id_str) {
        return null
    }
    let twitter_id_str = userData.id_str
    return twitter_id_str
}

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
async function registerParticipant(oauthToken, oauthTokenSecret, expId) {
    const experiment = await database.getExperimentById(expId);
    const expGroups = experiment.exp_groups;
    // raffle group for user, after hackathon do it using another file 
    let groupId = -1
    let username = ""
    if (userTwitterToken == "123"){
        groupId = 11
        username = "Nir"
    }
    else if (userTwitterToken == "456"){
        groupId = 12
        username = "Tal"

    }
    else{
        groupId = 12
        username = "Dekel"
    }

    // find exp group by groupId within experiment 
    const group = expGroups.filter(obj => {
        return obj.group_id == groupId
    })[0]

    // TODO lets put this logic in a user file that has method to create user
    let user = {
        "exp_id": expId,
        "group_id": group.group_id,
        "participant_twitter_id_str" : "99999",
        "user_twitter_token" : userTwitterToken,
        "group_manipulations": group.group_manipulations
    }
    
    const successRegister = await database.insertParticipant(user)
    if(successRegister){
        return user
    }
    return null

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

exports.registerParticipant = registerParticipant