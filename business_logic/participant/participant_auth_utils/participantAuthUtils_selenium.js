const authorizeUser = require("../../selenium_communicator/selenium_authorize/authorizeUser.js")
const database = require("../../db/DBCommunicator.js");


async function logInProcess(params,tab){
    const login_response = await authorizeUser.logInProcess(params,tab);
    return login_response;
}

async function userLogInReq(params,tab){
    const login_response = await authorizeUser.userLogInReq(params,tab);
    return login_response;
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
