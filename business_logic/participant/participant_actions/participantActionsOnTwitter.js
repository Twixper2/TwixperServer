const twitterComm = require("../../twitter_communicator/twitterCommunicator")

/* _____ Make and save every user action _____ */

async function likeTweet(participant, tweetId){    
    let likeSuccess = await twitterComm.likeTweet(participant, tweetId)
    
    // TODO: Call for logger to log the action

    return likeSuccess
}

async function unlikeTweet(participant, tweetId){    
    let likeSuccess = await twitterComm.unlikeTweet(participant, tweetId)
    
    // TODO: Call for logger to log the action

    return likeSuccess
}

exports.likeTweet = likeTweet
exports.unlikeTweet = unlikeTweet
