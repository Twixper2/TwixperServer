const twitterComm = require("../../twitter_communicator/twitterCommunicator")
const database = require("../../db/DBCommunicator")

/* _____ Make and save every user action _____ */

async function likeTweet(participant, tweetId){    
    let likeSuccess = await twitterComm.likeTweet(participant, tweetId) 

    //create the action obj and add to db for report
    let action = createActionObj(participant, "like", new Date())
    action['tweet'] = tweetId // will be replaced with entire tweet object
    database.insertAction(action) // not await

    // return response from twitter
    return likeSuccess
}

async function unlikeTweet(participant, tweetId){    
    let unlikeSuccess = await twitterComm.unlikeTweet(participant, tweetId)

    //create the action obj and add to db for report
    let action = createActionObj(participant, "unlike", new Date())
    action['tweet'] = tweetId // will be replaced with entire tweet object
    database.insertAction(action) // not await

    // return response from twitter
    return unlikeSuccess
}

async function publishTweet(participant, tweetParams){    
    let publishTweetSuccess = await twitterComm.publishTweet(participant, tweetParams)

    //create the action obj and add to db for report
    let action = createActionObj(participant, "tweeted", new Date())
    //action['tweet'] = tweetId // will be replaced with entire tweet object
    database.insertAction(action) // not await

    // return response from twitter
    return publishTweetSuccess
}



function createActionObj (participant, action_type, action_date) {
    return { 
        "exp_id": participant.exp_id,
        "action_type" : action_type,
        "action_date": action_date,
        "participant_twitter_username" : participant.participant_twitter_username, 
        "participant_group_id": participant.group_id
    }
}

exports.likeTweet = likeTweet
exports.unlikeTweet = unlikeTweet
exports.publishTweet = publishTweet
