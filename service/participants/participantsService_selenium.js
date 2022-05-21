const selenium_communicator = require("../../business_logic/selenium_communicator/selenium_communicator.js");
const participantAuthUtils_selenium = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils_selenium");
const manipulator = require("../../business_logic/participant/manipulator/manipulator.js")
const config = require("../../config");
const userCookiesDB = require("../../business_logic/db/mongodb/userCookiesCollection");
const bcrypt = require("bcryptjs");


/** ______Login_____ **/
async function logInProcess(params,access_token){

    let new_tab = await participantAuthUtils_selenium.createNewTab();
    let login_response = undefined;
    let user = params.user;

    if(params?.cookies){
        login_response = await participantAuthUtils_selenium.userLogInReq(params,new_tab);
    }

    else{
        login_response = await participantAuthUtils_selenium.logInProcess(params,new_tab);
        if(login_response){
            
            //First login - saves the cookies and tokens of the user
            await new Promise(r => setTimeout(r, 2000));
            let allCookies = await new_tab.manage().getCookies();
            await userCookiesDB.insertUserCookies(user,allCookies,access_token)
        }
    }

    let final_resp_without_tab = null;
    if(login_response){
        // Get initial content for participant
        let initial_content = await getInitialContentOfParticipant(new_tab,user);
        let dets_to_save = {tab:new_tab, user:user, access_token:access_token};
        // Save new tab to hashmap of selenium tabs
        let final_resp = {...dets_to_save, ...initial_content};
        config.tabsHashMap.set(access_token, final_resp);
        final_resp_without_tab = Object.assign({}, final_resp);
        delete final_resp_without_tab.tab;
        delete final_resp_without_tab.user;
    }
    else{
        new_tab.close();
    }
    return final_resp_without_tab
} 

/** ______User's initial content_____ **/
async function getInitialContentOfParticipant(tab,tweet_username){
    let feed = await getFeed(null,tab);
    let whoToFollowElement = await getWhoToFollow(null,tab);
    let user_profile_content = await getProfileContent(tweet_username,null,tab);
    return {user_profile_content,feed,whoToFollowElement};
}

/** ______User's data_____ **/
async function getWhoToFollow(params=null,tab_from_calling_function=null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let whoToFollowElement = await selenium_communicator.scrapeWhoToFollow(tab_to_use)
        return whoToFollowElement;
    }
    return null;
} 

async function validateAccessToken(params=null){
    let confirmation = false
    let userInfo = undefined; 
    if ( params != null ){
        userInfo = await participantAuthUtils_selenium.getUserInfo_utils(params?.user);
        if(userInfo?.access_token && bcrypt.compareSync(params.user + params.pass, userInfo.access_token)){
            return userInfo;
        }
    }
    return confirmation;
}


async function getFeed(params=null,tab_from_calling_function=null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let getFeed = await selenium_communicator.getFeed(tab_to_use)
        return getFeed;
        // if (getFeed) {
        //     getFeed = await manipulator.manipulateTweets(participant, getFeed)
        //     return twitterFeedTweets
        // }
    }
    return null;
}

async function getProfileContent(tweet_username,params = null,tab_from_calling_function = null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let getProfileContent = await selenium_communicator.getProfileContent(tab_to_use,tweet_username);
        return getProfileContent;
    }
    return null;
}

async function searchTweets(tab_from_calling_function, q){
    if (tab_from_calling_function != undefined){
        let getProfileContent = await selenium_communicator.getLatest_TweetsSearchResult(tab_from_calling_function,q);
        return getProfileContent;
    }
}

async function searchPeople(tab_from_calling_function,q){
    if (tab_from_calling_function != undefined){
        let getProfileContent = await selenium_communicator.getPeople_SearchResult(tab_from_calling_function, q);
        return getProfileContent;
    }
}
exports.logInProcess = logInProcess
exports.getWhoToFollow = getWhoToFollow
exports.getFeed = getFeed
exports.getProfileContent = getProfileContent
exports.searchTweets = searchTweets
exports.searchPeople = searchPeople
exports.validateAccessToken = validateAccessToken
