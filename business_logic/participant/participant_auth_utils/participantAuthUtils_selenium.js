const authorizeUser = require("../../selenium_communicator/selenium_authorize/authorizeUser.js")
const database = require("../../db/DBCommunicator.js");
const participantsService_selenium = require("../../../service/participants/participantsService_selenium.js");
const bcrypt = require("bcryptjs");


async function logInProcess(params,tab){
    const login_response = await authorizeUser.logInProcess(params,tab);
    return login_response;
}

async function userLogInReq(params,tab){
    const login_response = await authorizeUser.userLogInReq(params,tab);
    return login_response;
}

async function getUserAuthDetsIfExist(tabsHashMap, params){
    let twitter_data_to_send = null;
    let user_and_pass_encrypted = null;
    let cache = false;
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
    else if(params.access_token != null){
      // If user gave access_token, check if already auth'ed using db - load cookies if true
      let result = await participantsService_selenium.validateAccessToken(params);
      if(result){
        params.cookies = result.cookies;
        user_and_pass_encrypted = result.access_token;
        // Open tab again
        // Send client back his personal dets

        twitter_data_to_send = null;
      }
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

exports.logInProcess = logInProcess
exports.createNewTab = createNewTab
exports.getUserInfo_utils = getUserInfo_utils
exports.userLogInReq = userLogInReq
exports.validateAccessToken = validateAccessToken
exports.getUserAuthDetsIfExist = getUserAuthDetsIfExist
