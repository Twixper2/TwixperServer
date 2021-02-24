const twitterComm = require("../../twitter_communicator/twitterCommunicator")
const database = require("../../db/DBCommunicator.js");
const groupSelector = require("../participant_auth_utils/groupSelector")
/**
 * get experiment from db, deside group for praticipant, put inside the participant the data needed from experiment (group's manipulations) and add user to db
 * @param {*} userTwitterToken 
 * @param {*} expId 
 */
async function registerParticipant(oauthToken, oauthTokenSecret, expCode) {
    //checking auth info
    const twitterUser = await getTwitterUserFromTokens(oauthToken, oauthTokenSecret)
    if (!twitterUser) {
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
    let praticipantFromDb = await database.getParticipantByTwitterId(twitterUser.id_str)
    if (praticipantFromDb) {
        throw {
            name: "UserAlreadyRegistered",
            message: "User already registered."
        }
    }


    // raffle group for praticipant. currnetly only naive raffle supported
    const expGroups = exp.exp_groups;
    const group = groupSelector.selectGroup(expGroups, exp.num_of_participants) 

    // creating praticipant to add
    let praticipant = {
        "exp_id": exp.exp_id,
        "group_id": group.group_id,
        "participant_twitter_id_str": twitterUser.id_str,
        "participant_twitter_username": twitterUser.screen_name,
        "user_twitter_token" : oauthToken,
        "user_twitter_token_secret" : oauthTokenSecret,
        "group_manipulations": group.group_manipulations
    }
    
    const successRegister = await database.insertParticipant(praticipant)
    if(successRegister){
        return praticipant
    }
    return null
}

/**
 * return user twitter id if found, else null
 * @param {*} userTwitterToken 
 * @param {*} userTwitterTokenSecret 
 */
async function getTwitterUserFromTokens(userTwitterToken, userTwitterTokenSecret) {
    let userData =  await twitterComm.verifyCredentials(userTwitterToken,userTwitterTokenSecret)
    if (!userData || !userData.id_str) {
        return null
    }
    // let twitter_id_str = userData.id_str
    // return twitter_id_str
    return userData
}

exports.registerParticipant = registerParticipant
exports.getTwitterUserFromTokens = getTwitterUserFromTokens
