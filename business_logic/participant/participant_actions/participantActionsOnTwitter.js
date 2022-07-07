const twitterComm = require("../../twitter_communicator/twitterCommunicator")
const database = require("../../db/DBCommunicator")
const config = require('../../../config')

var moment = require('moment');
const dateFormat = config.dateFormat

/* _____ Make and save every user action _____ */

async function likeTweet(participant, tweetId,likeSuccess){    
    // let likeSuccess = await twitterComm.likeTweet(participant, tweetId) 

    //create the action obj and add to db for report
    const actionDate = moment.utc().format(dateFormat);
    let action = createActionObj(participant, "like", actionDate)
    action['tweet_obj'] = likeSuccess // entire tweet object
    database.insertAction(participant.exp_id, action) // not await

    // return response from twitter
    return likeSuccess
}

async function unlikeTweet(participant, tweetId,unlikeSuccess){    
    // let unlikeSuccess = await twitterComm.unlikeTweet(participant, tweetId)

    //create the action obj and add to db for report
    const actionDate = moment.utc().format(dateFormat);
    let action = createActionObj(participant, "unlike", actionDate)
    action['tweet_obj'] = unlikeSuccess // entire tweet object
    database.insertAction(participant.exp_id, action) // not await

    // return response from twitter
    return unlikeSuccess
}

async function follow(participant, screenName){    
    let followSuccess = await twitterComm.follow(participant, screenName)

    //create the action obj and add to db for report
    const actionDate = moment.utc().format(dateFormat);
    let action = createActionObj(participant, "follow", actionDate)
    action['user_obj'] = followSuccess // entire user object
    database.insertAction(participant.exp_id, action) // not await

    // return response from twitter
    return followSuccess
}

async function unfollow(participant, screenName){    
    let unfollowSuccess = await twitterComm.unfollow(participant, screenName)

    //create the action obj and add to db for report
    const actionDate = moment.utc().format(dateFormat);
    let action = createActionObj(participant, "unfollow", actionDate)
    action['user_obj'] = unfollowSuccess // entire user object
    database.insertAction(participant.exp_id, action) // not await

    // return response from twitter
    return unfollowSuccess
}

async function publishTweet(participant, tweetParams ,publishTweetSuccess){    
    // let publishTweetSuccess = await twitterComm.publishTweet(participant, tweetParams)

    // Create the action obj and add to db for report
    let actionType = "tweeted"
    // Check if this regular tweet, comment or quote
    if(tweetParams.in_reply_to_status_id){
        actionType = "replied"
    }
    else if(tweetParams.attachment_url){
        actionType = "quoted"
    }   
    const actionDate = moment.utc().format(dateFormat);
    let action = createActionObj(participant, actionType, actionDate)
    action['tweet_obj'] = publishTweetSuccess // entire tweet object
    database.insertAction(participant.exp_id, action) // not await

    // return response from twitter
    return publishTweetSuccess
}

async function publishRetweet(participant, tweetId){    
    let publishRetweetSuccess = await twitterComm.publishRetweet(participant, tweetId)

    // Create the action obj and add to db for report
    const actionDate = moment.utc().format(dateFormat);
    let action = createActionObj(participant, "retweeted", actionDate)
    action['tweet_obj'] = publishRetweetSuccess // entire tweet object
    database.insertAction(participant.exp_id, action) // not await

    // return response from twitter
    return publishRetweetSuccess
}

/* ----------------------------------------
    Log of other actions
   ---------------------------------------- */

function logRegisteredToExperiment(participant){
    //create the action obj and add to db for report
    const actionDate = moment.utc().format(dateFormat);
    let action = createActionObj(participant, "registered to experiment", actionDate)
    database.insertAction(participant.exp_id, action) // not await
}

function logParticipantActions(participant, actions){
    // Add fields to each action
    actions.forEach(actionObj => {
        actionObj.participant_twitter_username = participant.participant_twitter_username
        actionObj.participant_group_id = participant.group_id
    });
    database.insertActionsArray(participant.exp_id, actions) // not await
}


function createActionObj (participant, action_type, action_date) {
    return { 
        "action_type" : action_type,
        "action_date": action_date,
        "participant_twitter_username" : participant.participant_twitter_username, 
        "participant_group_id": participant.group_id
    }
}

function validateActionsFields(actions){
    if (!Array.isArray(actions)) {  // not an array
        return false
    }
    actions.forEach((actionObj) => {
        if (!typeof actionObj === 'object') {  // not an obj
            return false
        }
        // Checking required fields
        if(actionObj.action_type == null || actionObj.action_date == null){
            return false
        }
    })
    return true
}

exports.likeTweet = likeTweet
exports.unlikeTweet = unlikeTweet
exports.follow = follow
exports.unfollow = unfollow
exports.publishTweet = publishTweet
exports.publishRetweet = publishRetweet
exports.logRegisteredToExperiment = logRegisteredToExperiment
exports.validateActionsFields = validateActionsFields
exports.logParticipantActions = logParticipantActions
exports.createActionObj = createActionObj
