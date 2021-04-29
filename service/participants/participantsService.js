const participantSearchInTwitter = require("../../business_logic/participant/participant_manipulated_data/participantSearchInTwitter");
const participantSpecifiedTwitterData = require("../../business_logic/participant/participant_manipulated_data/participantSpecifiedTwitterData");
const participantAuthUtils = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils");
const participantFeed =  require("../../business_logic/participant/participant_manipulated_data/participantFeed");
const participantActionsOnTwitter =  require("../../business_logic/participant/participant_actions/participantActionsOnTwitter");

/** ______Search for participant_____ **/

async function searchTweets(q){
    let output = await participantSearchInTwitter.searchTweets(q)
    return output
}

async function searchUsers(q){    
    let output = await participantSearchInTwitter.searchUsers(q)
    return output
}



/**_______ Get data from twitter ______ **/

/**
 * feed for authenticated user
 * @param {*} user 
 */
async function getFeed(participant){
    let output = await participantFeed.getFeed(participant)
    return output
}

/* TODO add participant as input */
async function getUser(username){
    let output = await participantSpecifiedTwitterData.getUser(username)
    return output
}

async function getTweet(tweetId){
    let output = await participantSpecifiedTwitterData.getTweet(tweetId)
    return output
}

async function getUserFriends(participant, username){
    let output = await participantSpecifiedTwitterData.getUserFriends(participant, username)
    return output
}

async function getUserFollowers(participant, username){
    let output = await participantSpecifiedTwitterData.getUserFollowers(participant, username)
    return output
}

async function getUserTimeline(userId){
    let output = await participantSpecifiedTwitterData.getUserTimeline(userId)
    return output
}

async function getUserLikes(participant, username){
    let output = await participantSpecifiedTwitterData.getUserLikes(participant, username)
    return output
}



/** ______ Participant actions handlers ______ **/

async function likeTweet(participant, tweetId) {
    let output = await participantActionsOnTwitter.likeTweet(participant, tweetId)
    return output
}

async function unlikeTweet(participant, tweetId) {
    let output = await participantActionsOnTwitter.unlikeTweet(participant, tweetId)
    return output
}

async function publishTweet(participant, tweetParams) {
    let output = await participantActionsOnTwitter.publishTweet(participant, tweetParams)
    return output
}


/**_____ Participants auth ______ **/

async function getTwitterRequestToken(oathCallback){
    let output = await participantAuthUtils.getTwitterRequestToken(oathCallback)
    return output
}

async function getTwitterAccesssToken(token, verifier){
    let output = await participantAuthUtils.getTwitterAccesssToken(token, verifier)
    return output
}

/**
 * get experiment from db, deside group for praticipant, put inside the participant the data needed from experiment (group's manipulations) and add user to db
 * @param {*} userTwitterToken 
 * @param {*} expId 
 */
async function registerParticipant(oauthToken, oauthTokenSecret, expCode) {
    let output = await participantAuthUtils.registerParticipant(oauthToken, oauthTokenSecret, expCode)
    return output
}

/**
 * return user twitter id if found, else null
 * @param {*} userTwitterToken 
 * @param {*} userTwitterTokenSecret 
 */
async function getTwitterUserFromTokens(userTwitterToken, userTwitterTokenSecret) {
    let output = await participantAuthUtils.getTwitterUserFromTokens(userTwitterToken, userTwitterTokenSecret)
    return output
}


/* ----------------------------------------
    Log of participant's actions
   ---------------------------------------- */

function validateActionsFields(actions){
    return participantActionsOnTwitter.validateActionsFields(actions)
}

function logParticipantActions(participant, actions){
    return participantActionsOnTwitter.logParticipantActions(participant, actions)
}

/* ----------------------------------------
    Other helper functions
   ---------------------------------------- */

function extractTwitterInfoFromParticipantObj(participant){
    return participantAuthUtils.extractTwitterInfoFromParticipantObj(participant)
}

exports.getTwitterRequestToken = getTwitterRequestToken
exports.getTwitterAccesssToken = getTwitterAccesssToken
exports.getTwitterUserFromTokens = getTwitterUserFromTokens
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

exports.likeTweet = likeTweet
exports.unlikeTweet = unlikeTweet
exports.publishTweet = publishTweet

exports.validateActionsFields = validateActionsFields
exports.logParticipantActions = logParticipantActions

exports.extractTwitterInfoFromParticipantObj = extractTwitterInfoFromParticipantObj