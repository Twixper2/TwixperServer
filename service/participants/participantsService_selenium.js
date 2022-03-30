const participant_data_selenium = require("../../business_logic/participant/selenium_scraping_data/participant_data_selenium");

/** ______Login_____ **/
async function logInProcess(params){

    var new_tab = await participantAuthUtils_selenium.createNewTab()

    var login_response = await participantAuthUtils_selenium.logInProcess(params,new_tab)
    return [login_response,new_tab]
} 

async function getWhoToFollow(params){

    //TODO: Get tab to request from
    var tab = await getTabFromDB(params);

    var whoToFollowElement = await participant_data_selenium.scrapeWhoToFollow(tab)
    return whoToFollowElement
} 


exports.logInProcess = logInProcess
exports.getWhoToFollow = getWhoToFollow