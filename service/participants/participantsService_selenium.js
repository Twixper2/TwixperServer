const selenium_communicator = require("../../business_logic/selenium_communicator/selenium_communicator.js");
const participantAuthUtils_selenium = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils_selenium");
const manipulator = require("../../business_logic/participant/manipulator/manipulator.js")
const config = require("../../config");
const userCookiesDB = require("../../business_logic/db/mongodb/userCookiesCollection");
const bcrypt = require("bcryptjs");
const scrapeTwitter_moshe = require("../../business_logic/selenium_communicator/selenium_communicator")


/** ______Login_____ **/
async function logInProcess(params,access_token){

    let new_tab = await participantAuthUtils_selenium.createNewTab();
    let login_response = undefined;
    let user = params.user;

    // if(params?.cookies){
    //     login_response = await participantAuthUtils_selenium.userLogInReq(params,new_tab);
    // }
    login_response = await participantAuthUtils_selenium.logInProcess(params,new_tab);
    if(login_response){
        
        //First login - saves the cookies and tokens of the user
        await new Promise(r => setTimeout(r, 2000));
        let allCookies = await new_tab.manage().getCookies();
        await userCookiesDB.insertUserCookies(user,allCookies,access_token)
    }
    let final_resp_without_tab = null;
    if(login_response){
        //open user profile page
        // await new_tab.executeScript(`window.open("${user}");`);
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
async function getInitialContentOfParticipant(tab,req_user){
    let feed = await getFeed(null,tab);
    let whoToFollowElement = await getWhoToFollow(null,tab);
    let userEntityDetails = await getUserEntityDetails({req_user},tab);
    let userTimeline = await getUserTimeline({req_user},tab);
    let userLikes = await getUserLikes({req_user},tab);
    return {user_profile_content:{userEntityDetails,userTimeline,userLikes},feed,whoToFollowElement};
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

async function getFeed(params=null,tab_from_calling_function=null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let getFeed = await selenium_communicator.getFeed(tab_to_use);
        if (getFeed && params) {
            getFeed = await manipulator.manipulateTweets(params.participant, getFeed)
        }
        return getFeed;
    }
    return null;
}

async function getTweet(params = null,tab_from_calling_function = null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }
        let getTweet = await selenium_communicator.getTweet(tab_to_use,params.tweetUser,params.tweetIdStr);
        return getTweet;
    }
    return null;
}

/** ______User's profile content_____ **/
async function getUserEntityDetails(params = null,tab_from_calling_function = null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }
        let getUserEntityDetails = await selenium_communicator.getUserEntityDetails(tab_to_use,params.req_user);
        return getUserEntityDetails;
    }
    return null;
}

async function getUserTimeline(params = null,tab_from_calling_function = null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let getUserTimeline = await selenium_communicator.getUserTimeline(tab_to_use,params.req_user);
        return getUserTimeline;
    }
    return null;
}

async function getUserLikes(params = null,tab_from_calling_function = null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }
        let getUserLikes = await selenium_communicator.getUserLikes(tab_to_use,params.req_user);
        return getUserLikes;
    }
    return null;
}

/** ______Search for participant 2_____ **/

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
async function newTweetsSearch(tab_from_calling_function,q){
    if (tab_from_calling_function != undefined){
        let searchResult = await selenium_communicator.newTweetsSearch(tab_from_calling_function,q);
        return searchResult;
    }
}
async function newPeopleSearch(tab_from_calling_function,q){
    if (tab_from_calling_function != undefined){
        let searchResult = await selenium_communicator.newPeopleSearch(tab_from_calling_function,q);
        return searchResult;
    }
}
async function getMoreSearchResult(tab_from_calling_function,mode){
    if (tab_from_calling_function != undefined){
        let searchResult = await selenium_communicator.getMoreSearchResult(tab_from_calling_function,mode);
        return searchResult;
    }
}
async function closeSecondTab(tab_from_calling_function){
    if (tab_from_calling_function != undefined){
        await selenium_communicator.closeSecondTab(tab_from_calling_function);
        return true;
    }
}
async function postTweet(tab_from_calling_function,tweetContext){
    if (tab_from_calling_function != undefined){
        await selenium_communicator.postTweet(tab_from_calling_function,tweetContext);
        return true;
    }
}

/** ______Register To Exp'_____ **/

async function registerParticipant(username, access_token, expCode){
    return await participantAuthUtils_selenium.registerParticipant(username, access_token, expCode);
}





exports.logInProcess = logInProcess
exports.getWhoToFollow = getWhoToFollow
exports.getFeed = getFeed
exports.getUserEntityDetails = getUserEntityDetails
exports.searchTweets = searchTweets
exports.searchPeople = searchPeople
exports.newTweetsSearch = newTweetsSearch
exports.newPeopleSearch = newPeopleSearch
exports.getUserTimeline = getUserTimeline
exports.getUserLikes = getUserLikes
exports.getMoreSearchResult = getMoreSearchResult
exports.closeSecondTab = closeSecondTab
exports.postTweet=postTweet
exports.getTweet=getTweet
exports.registerParticipant=registerParticipant