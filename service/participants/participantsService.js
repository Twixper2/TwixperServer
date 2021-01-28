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
async function registerParticipant(oauthToken, oauthTokenSecret, expCode) {
    //checking auth info
    const twitterIdStr = await getTwitterIdFromTokens(oauthToken, oauthTokenSecret)
    if (!twitterIdStr) {
        throw {
            name: "InvalidAuthInfo",
            message: "Not a twitter user."
        }
    }
    //checking experiment
    const exp = await database.getExperimentByCode(expCode); 
    if(!exp || !exp.exp_id){  //no such experiment
      throw {
          name: "NoSuchExperiment",
          message: "No such experiment."
        }
    }
    // verifying not already registered
    let userFromDB = await database.getParticipant(twitterIdStr)
    if (userFromDB) {
        throw {
            name: "UserAlreadyRegistered",
            message: "User already registered."
        }
    }


    // raffle group for user
    const expGroups = exp.exp_groups;
    const group = groupSelector.selectGroup(expGroups) 

    // creating user to add
    let user = {
        "exp_id": exp.exp_id,
        "group_id": group.group_id,
        "participant_twitter_id_str" : twitterIdStr,
        "user_twitter_token" : oauthToken,
        "user_twitter_token_secret" : oauthTokenSecret,
        "group_manipulations": group.group_manipulations
    }
    
    const successRegister = await database.insertParticipant(user)
    if(successRegister){
        return user
    }
    return null

}

exports.getTwitterIdFromTokens = getTwitterIdFromTokens
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