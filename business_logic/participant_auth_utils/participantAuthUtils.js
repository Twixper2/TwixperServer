const twitterComm = require("../twitter_communicator/twitterCommunicator")
const manipulator = require("../manipulator/manipulator.js")
const database = require("../db/DBCommunicator.js");
const { data } = require("../twitter_communicator/static_twitter_data/FeedJSON");

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

exports.registerParticipant = registerParticipant
exports.getTwitterIdFromTokens = getTwitterIdFromTokens
