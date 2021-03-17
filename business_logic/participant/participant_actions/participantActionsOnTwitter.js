const twitterComm = require("../../twitter_communicator/twitterCommunicator")
const database = require("../../db/DBCommunicator")
const config = require('../../../config')

var moment = require('moment');
const dateFormat = config.dateFormat

/* _____ Make and save every user action _____ */

async function likeTweet(participant, tweetId){    
    let likeSuccess = await twitterComm.likeTweet(participant, tweetId) 

    //create the action obj and add to db for report
    const actionDate = moment().format(dateFormat);
    let action = createActionObj(participant, "like", actionDate)
    action['tweet_obj'] = likeSuccess // entire tweet object
    database.insertAction(participant.exp_id, action) // not await

    // return response from twitter
    return likeSuccess
}

async function unlikeTweet(participant, tweetId){    
    let unlikeSuccess = await twitterComm.unlikeTweet(participant, tweetId)

    //create the action obj and add to db for report
    const actionDate = moment().format(dateFormat);
    let action = createActionObj(participant, "unlike", actionDate)
    action['tweet_obj'] = unlikeSuccess // entire tweet object
    database.insertAction(participant.exp_id, action) // not await

    // return response from twitter
    return unlikeSuccess
}

async function publishTweet(participant, tweetParams){    
    let publishTweetSuccess = await twitterComm.publishTweet(participant, tweetParams)

    //create the action obj and add to db for report
    const actionDate = moment().format(dateFormat);
    let action = createActionObj(participant, "tweeted", actionDate)
    action['tweet_obj'] = publishTweetSuccess // entire tweet object
    database.insertAction(participant.exp_id, action) // not await

    // return response from twitter
    return publishTweetSuccess
}


/* ----------------------------------------
    Log of other actions
   ---------------------------------------- */

function logRegisteredToExperiment(participant){
    //create the action obj and add to db for report
    const actionDate = moment().format(dateFormat);
    let action = createActionObj(participant, "registered to experiment", actionDate)
    database.insertAction(participant.exp_id, action) // not await
}

function logParticipantActions(participant, actions){
    // Add fileds to each action
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
        if (!typeof actionObj === 'object') {    // not an obj
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
exports.publishTweet = publishTweet
exports.logRegisteredToExperiment = logRegisteredToExperiment
exports.validateActionsFields = validateActionsFields
exports.logParticipantActions = logParticipantActions
