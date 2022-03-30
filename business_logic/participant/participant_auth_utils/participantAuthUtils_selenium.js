const authorizeUser = require("../../twitter_communicator/selenium_authorize/authorizeUser")
const database = require("../../db/DBCommunicator.js");


async function logInProcess(params,tab){
    const login_response = await authorizeUser.logInProcess(params,tab);
    return login_response;
}

async function createNewTab(){
    const tab = await authorizeUser.createNewTab()
    return tab;
}

exports.logInProcess = logInProcess
exports.createNewTab = createNewTab
