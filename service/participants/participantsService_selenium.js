const participant_data_selenium = require("../../business_logic/participant/selenium_scraping_data/participant_data_selenium");
const participantAuthUtils_selenium = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils_selenium");
const config = require("../../config");

/** ______Login_____ **/
async function logInProcess(params){

    var new_tab = await participantAuthUtils_selenium.createNewTab()

    var login_response = await participantAuthUtils_selenium.logInProcess(params,new_tab)
    if(login_response == "Successfully signed in twitter!"){
        // Save new tab to hashmap of selenium tabs
        config.tabsHashMap.set(params.user,new_tab);
    }
    return login_response
} 

/** ______User's data_____ **/
async function getWhoToFollow(params){

    // Get tab to request
    var tab = config.tabsHashMap.get(params.user);

    var whoToFollowElement = await participant_data_selenium.scrapeWhoToFollow(tab)
    return whoToFollowElement
} 


exports.logInProcess = logInProcess
exports.getWhoToFollow = getWhoToFollow