const twitterComm = require("../../twitter_communicator/twitterCommunicator")
const twitterInnerApiUtils = require("../../twitter_communicator/twitter_internal_api/twitterInnerApiUtils")

async function getUser(username){ // Later we will also send "praticipant" obj for manipulations.
    const twitterGetUser = await twitterComm.getUser(username)
    
    return twitterGetUser
}

async function getTweet(tweetId){
    let tweetObj = await twitterComm.getTweet(tweetId)
    tweetObj = twitterInnerApiUtils.formatTweetPageObject(tweetObj, tweetId)
    return tweetObj
}

async function getUserFriends(participant, username){
    const twitterGetUserFriends = await twitterComm.getUserFriends(participant, username)
    return twitterGetUserFriends
}

async function getUserFollowers(participant, username){
    const twitterGetUserFollowers = await twitterComm.getUserFollowers(participant, username)
    return twitterGetUserFollowers
}

async function getUserTimeline(username){
    const twitterGetUserTimeline = await twitterComm.getUserTimeline(username)
    
    return twitterGetUserTimeline
}

async function getUserLikes(participant, username){
    const twitterGetUserLikes = await twitterComm.getUserLikes(participant, username)
    return twitterGetUserLikes
}


exports.getUser = getUser
exports.getTweet = getTweet
exports.getUserFriends = getUserFriends
exports.getUserFollowers = getUserFollowers
exports.getUserTimeline = getUserTimeline
exports.getUserLikes = getUserLikes
