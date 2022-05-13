const selenium_communicator = require("../../business_logic/selenium_communicator/selenium_communicator.js");
const participantAuthUtils_selenium = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils_selenium");
const manipulator = require("../../business_logic/participant/manipulator/manipulator.js")
const config = require("../../config");

/** ______Login_____ **/
async function logInProcess(params){

    let new_tab = await participantAuthUtils_selenium.createNewTab()

    let login_response = await participantAuthUtils_selenium.logInProcess(params,new_tab)
    if(login_response){
        let user_entity_data = await getUserEntityData(new_tab);
        // Save new tab to hashmap of selenium tabs
        config.tabsHashMap.set(encryptToken(params.user + params.pass),[new_tab,user_entity_data]);
    }
    else{
        new_tab.close();
    }
    return login_response
} 

/** ______User's data_____ **/
async function getWhoToFollow(params){

    // Get tab to request
    let tab = config.tabsHashMap.get(params.user);

    let whoToFollowElement = await selenium_communicator.scrapeWhoToFollow(tab)
    return whoToFollowElement
} 

async function getUserEntityData(tab){
    let userEntityData = await selenium_communicator.getUserEntityData(tab)
    return userEntityData
}

async function getFeed(params){

    // Get tab to request
    var tab = config.tabsHashMap.get(params.user);

    let getFeed = await selenium_communicator.getFeed(tab)
    if (getFeed) {
        getFeed = await manipulator.manipulateTweets(participant, getFeed)
        return twitterFeedTweets
    }
    return null
}

function encryptToken(token) {
    return bcrypt.hashSync(token, 10);
}


exports.logInProcess = logInProcess
exports.getWhoToFollow = getWhoToFollow
exports.getFeed = getFeed