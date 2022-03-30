const participantAuthUtils_selenium = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils_selenium");

/** ______Get Login Response_____ **/
async function logInProcess(params){

    var new_tab = await participantAuthUtils_selenium.createNewTab()

    var login_response = await participantAuthUtils_selenium.logInProcess(params,new_tab)
    return [login_response,new_tab]
} 


exports.logInProcess = logInProcess