const authorizeUser = require("../../selenium_communicator/selenium_authorize/authorizeUser.js")
const database = require("../../db/DBCommunicator.js");
const participantsService_selenium = require("../../../service/participants/participantsService_selenium.js");
const bcrypt = require("bcryptjs");
const { tabsHashMap } = require("../../../config");
const groupSelector = require("../participant_auth_utils/groupSelector")
const participantActionsOnTwitter = require("../participant_actions/participantActionsOnTwitter.js")


async function logInProcess(params,tab){
    const login_response = await authorizeUser.logInProcess(params,tab);
    return login_response;
}

async function userLogInReq(params,tab){
    const login_response = await authorizeUser.userLogInReq(params,tab);
    return login_response;
}

async function IsAccessTokenInTabHashMap(access_token){
  return tabsHashMap.get(access_token);
}

async function getUserAuthDetsIfExist(params){
    let twitter_data_to_send = null;
    let user_and_pass_encrypted = null;
    let cache = false;
    let result = null;
    // Check if user already auth'ed using hashmap
    if(tabsHashMap.size > 0){
      for (var entry of tabsHashMap.entries()) {
        let key = entry[0],
            value = entry[1];
        if(bcrypt.compareSync(params.user + params.pass, key)){
          // Found tab open
          // assign profile dets, feed, etc.
          twitter_data_to_send = Object.assign({}, value);
          delete twitter_data_to_send.tab;
          delete twitter_data_to_send.user;
          break;
        }
      }
    }
    // If user gave access_token, check if already auth'ed using db - load cookies if true

    // result = await validateAccessToken(params);
    if(result){
    params.cookies = result.cookies;
    user_and_pass_encrypted = result.access_token;

    // Open tab again
    // Send client back his personal dets

    twitter_data_to_send = null;
    }
    else{
      // Create new authentication for the user
      user_and_pass_encrypted = bcrypt.hashSync(params.user + params.pass,parseInt(process.env.bcrypt_saltRounds));
    }
    return {twitter_data_to_send, user_and_pass_encrypted};
}

async function validateAccessToken(params=null){
    let confirmation = false
    let userInfo = undefined; 
    if ( params != null ){
        userInfo = await getUserInfo_utils(params?.user);
        if(userInfo?.access_token && bcrypt.compareSync(params.user + params.pass, userInfo.access_token)){
            return userInfo;
        }
    }
    return confirmation;
}

async function getUserInfo_utils(user=null){
    if ( user != null ){
        return await database.getInfoByTwitterUserName(user);
    }
    return null;
}

async function createNewTab(){
    const tab = await authorizeUser.createNewTab()
    return tab;
}

/**
 * get experiment from db, decide group for participant, 
 * put inside participant the group's manipulations
 * and add user to db
 * @param {*} username 
 * @param {*} expCode 
 */
async function registerParticipant(username, access_token, expCode){
  // twitter validation
  const twitterUserDetails = await IsAccessTokenInTabHashMap(access_token);
  if (twitterUserDetails == undefined) {
      throw {
          name: "InvalidAuthInfo",
          message: "Not validated as a twitter user."
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
  if(exp.status != "active"){
      throw {
          name: "ExperimentNotActive",
          message: "This experiment was ended by the researcher."
      }
  }

  // verifying not already registered
  let participantFromDb = await database.getParticipantByUsername(username);
  if (participantFromDb) {
      throw {
          name: "UserAlreadyRegistered",
          message: "User already registered."
      }
  }

  // raffle group for participant. currently, only naive raffle supported
  const expGroups = exp.exp_groups;
  const group = groupSelector.selectGroup(expGroups, exp.num_of_participants) 
  let initial_content = await  participantsService_selenium.firstLoginDataExtraction(true,twitterUserDetails)
  let user_entity_details = initial_content.user_profile_content.userEntityDetails.entity_details;
  // creating participant to add
  let participant = {
      "exp_id": exp.exp_id,
      "group_id": group.group_id,
      "participant_twitter_username": twitterUserDetails.user,
      "participant_twitter_name": user_entity_details.username,
      "participant_twitter_friends_count": user_entity_details.following_count,
      "participant_twitter_followers_count": user_entity_details.followers_count,
      "participant_twitter_profile_image": user_entity_details.profile_img,
      "group_manipulations": group.group_manipulations
  }
  
  const successRegister = await database.insertParticipant(participant);
  if(successRegister){
      // Log the registration to actions log of the experiment
      participantActionsOnTwitter.logRegisteredToExperiment(participant);
      participant.initial_content = initial_content;
      return participant;
  }
  return null
}

function extractTwitterInfoFromParticipantObj(participant){
    return {
        "screen_name": participant.participant_twitter_username,
        "name": participant.participant_twitter_name,
        "friends_count": participant.participant_twitter_friends_count, 
        "followers_count": participant.participant_twitter_followers_count,
        "profile_image_url_https": participant.participant_twitter_profile_image
    }
}

exports.logInProcess = logInProcess
exports.createNewTab = createNewTab
exports.getUserInfo_utils = getUserInfo_utils
exports.userLogInReq = userLogInReq
exports.validateAccessToken = validateAccessToken
exports.getUserAuthDetsIfExist = getUserAuthDetsIfExist
exports.registerParticipant = registerParticipant
exports.IsAccessTokenInTabHashMap = IsAccessTokenInTabHashMap
exports.extractTwitterInfoFromParticipantObj = extractTwitterInfoFromParticipantObj
