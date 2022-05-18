const selenium_communicator = require("../../business_logic/selenium_communicator/selenium_communicator.js");
const participantAuthUtils_selenium = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils_selenium");
const manipulator = require("../../business_logic/participant/manipulator/manipulator.js")
const config = require("../../config");


/** ______Login_____ **/
async function logInProcess(params,access_token){
    let new_tab = await participantAuthUtils_selenium.createNewTab();

    let login_response = await participantAuthUtils_selenium.logInProcess(params,new_tab);
    let final_resp = undefined;
    if(login_response){
        let user = params.user;
        // Get initial content for participant
        let initial_content = await getInitialContentOfParticipant(new_tab,user);
        let dets_to_save = {tab: new_tab,user : user};
        // Save new tab to hashmap of selenium tabs
        final_resp = {...dets_to_save, ...initial_content};
        config.tabsHashMap.set(access_token, final_resp);
    }
    else{
        new_tab.close();
    }
    return final_resp
} 


/** ______User's initial content_____ **/
async function getInitialContentOfParticipant(tab,tweet_username){
    let feed = await getFeed(undefined,tab);
    let whoToFollowElement = await getWhoToFollow(undefined,tab);
    let user_profile_content = await getProfileContent(tweet_username,undefined,tab);
    return {user_profile_content,feed,whoToFollowElement};
}

/** ______User's data_____ **/
async function getWhoToFollow(params=undefined,tab_from_calling_function=undefined){
    if (params != undefined || tab_from_calling_function != undefined){
        let tab_to_use = undefined;

        if (tab_from_calling_function != undefined){
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

async function getFeed(params=undefined,tab_from_calling_function=undefined){
    if (params != undefined || tab_from_calling_function != undefined){
        let tab_to_use = undefined;

        if (tab_from_calling_function != undefined){
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

async function getProfileContent(tweet_username,params = undefined,tab_from_calling_function = undefined){
    if (params != undefined || tab_from_calling_function != undefined){
        let tab_to_use = undefined;

        if (tab_from_calling_function != undefined){
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

async function searchTweets(q,params = undefined,tab_from_calling_function = undefined){
    if (params != undefined || tab_from_calling_function != undefined){
        let tab_to_use = undefined;

        if (tab_from_calling_function != undefined){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let getProfileContent = await selenium_communicator.getTop_TweetsSearchResult(tab_to_use,q);
        return getProfileContent;
    }
}

async function searchPeople(q,params = undefined,tab_from_calling_function = undefined){
    if (params != undefined || tab_from_calling_function != undefined){
        let tab_to_use = undefined;

        if (tab_from_calling_function != undefined){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let getProfileContent = await selenium_communicator.getPeople_SearchResult(tab_to_use,q);
        return getProfileContent;
    }
}
exports.logInProcess = logInProcess
exports.getWhoToFollow = getWhoToFollow
exports.getFeed = getFeed
exports.getProfileContent = getProfileContent
exports.searchTweets = searchTweets
exports.searchPeople = searchPeople
