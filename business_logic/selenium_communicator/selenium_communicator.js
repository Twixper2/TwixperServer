const scrapeTwitter = require("../selenium_communicator/scrape_process/scrapeTwitter.js")
const scrapeTwitter_moshe = require("../selenium_communicator/scrape_process/scrapeTwitter_moshe")
const {twitter_address, status_text, twitter_home_address} = require("../../business_logic/twitter_communicator/static_twitter_data/ConstantsJSON.js");
const JS_SCROLL_BOTTOM = 'window.scrollTo(0, document.body.scrollHeight)';
const database = require("../../business_logic/db/DBCommunicator.js");
const JS_HALF_SCROLL_BOTTOM = 'window.scrollTo(0, document.body.scrollHeight / 2)';


// Helpers

async function reloadPage(tab){
    try{
        tab.navigate().refresh();
    }
    catch(error){
       console.log('error with reloading page');
    }
    
}

async function scrollPost(tab){
    try{
        await tab.executeScript(JS_HALF_SCROLL_BOTTOM);
        await tabWait(tab,5000);
    }
    catch(error){
        console.log('error with scrollPost');
    }    
}

async function tabWait(tab,ms){
    try{
        await tab.wait(() => {let x=null;}, ms);
    }
    catch{
        return true;
    }    
}

async function isRequestedURLSameAsCurrent(tab,req_url){
    try{
        // console.log(await tab.getCurrentUrl());
        // console.log(req_url);

        return await tab.getCurrentUrl() === req_url;
    }
    catch(error){
        console.log('error with isRequestedURLSameAsCurrent');
    }     
}

async function redirectToPage(tab,url,reloadingPage){
    try{
        await tab.get(url);
        if(reloadingPage){
            await reloadPage(tab)
        }
        await tabWait(tab,5000);
    }
    catch(error){
        console.log('error with redirectToPage');
    }   
}

// Selenium comm

async function scrapeWhoToFollow(tab){
    if(!await isRequestedURLSameAsCurrent(tab, twitter_home_address)){
        await redirectToPage(tab,twitter_home_address,false);
    }
    return await scrapeTwitter.scrapeWhoToFollow(tab);
}

async function getFeed(tab){
    if(!await isRequestedURLSameAsCurrent(tab, twitter_home_address)){
        await redirectToPage(tab,twitter_home_address,false);
    }
    await scrollPost(tab);
    return await scrapeTwitter.getFeed(tab);
}

async function getUserEntityDetails(tab,tweet_username){
    let profile_url = twitter_address+tweet_username;
    if(!await isRequestedURLSameAsCurrent(tab, profile_url)){
        await redirectToPage(tab,profile_url,true);
    }
    return await scrapeTwitter.getUserEntityDetails(tab);
}

async function getUserTimeline(tab,tweet_username){
    let profile_url = twitter_address+tweet_username;
    if(!await isRequestedURLSameAsCurrent(tab, profile_url)){
        await redirectToPage(tab,profile_url,true);
    }
    return await scrapeTwitter.getFeed(tab);
}

async function getUserLikes(tab,tweet_username){
    let profile_likes_url = twitter_address+tweet_username+"/likes";
    if(!await isRequestedURLSameAsCurrent(tab, profile_likes_url)){
        await redirectToPage(tab,profile_likes_url,false);
    }
    return await scrapeTwitter.getUserLikes(tab);
}

async function getTweet(tab,tweet_username,tweet_id_str){
    let tweet_url = twitter_address+tweet_username+'/'+status_text+'/'+tweet_id_str;
    if(!await isRequestedURLSameAsCurrent(tab, tweet_url)){
        await redirectToPage(tab,tweet_url,false);
    }
    return await scrapeTwitter.getTweet(tab,tweet_id_str);
}

async function getTop_TweetsSearchResult(tab,q){
    return await scrapeTwitter_moshe.searchTwitterTweets(tab,q,"top");
}

async function getLatest_TweetsSearchResult(tab,q){
    return await scrapeTwitter_moshe.searchTwitterTweets(tab,q,"live");
}

async function getPeople_SearchResult(tab,q){
    return await scrapeTwitter_moshe.searchTwitterPeople(tab,q);
}

async function newTweetsSearch(tab,q){
    return await scrapeTwitter_moshe.openTweetsSearchTab(tab,q);
}

async function newPeopleSearch(tab,q){
    return await scrapeTwitter_moshe.openPeopleSearchTab(tab,q);
}

async function getMoreSearchResult(tab,mode){
    return await scrapeTwitter_moshe.getMoreSearchResult(tab,mode);
}

async function closeSecondTab(tab){
    return await scrapeTwitter_moshe.closeSecondTab(tab);
}

async function postTweet(tab,tweetContext){
    return await scrapeTwitter_moshe.postTweets(tab,tweetContext);
}

async function tweetsAction(tab,tweet_id,screen_name,action,reply,ShareVia){
    return await scrapeTwitter_moshe.tweetsActionManager(tab,tweet_id,screen_name,action,reply,ShareVia);
}

async function getNotifications(tab){
    return await scrapeTwitter_moshe.getNotifications(tab);
}

async function doIHaveNewNotifications(tab){
    return await scrapeTwitter_moshe.doIHaveNewNotifications(tab);
}

async function getAllUserCookie(){
    let allParticipants = await database.getAllActiveParticipant();
    let cookieJar = [];
    await Promise.all(allParticipants.map(async (participant) => {
        var user = participant.participant_twitter_username;
        let DbResult = await database.getInfoByTwitterUserName(user);
        if(DbResult){
            cookieJar.push(DbResult);
        }
         
    }));
    return cookieJar;
}

exports.scrapeWhoToFollow = scrapeWhoToFollow
exports.getFeed = getFeed
exports.getUserEntityDetails = getUserEntityDetails
exports.getTop_TweetsSearchResult = getTop_TweetsSearchResult
exports.getLatest_TweetsSearchResult = getLatest_TweetsSearchResult
exports.getPeople_SearchResult = getPeople_SearchResult
exports.newTweetsSearch = newTweetsSearch
exports.newPeopleSearch = newPeopleSearch
exports.getUserTimeline = getUserTimeline
exports.getUserLikes = getUserLikes
exports.getMoreSearchResult = getMoreSearchResult
exports.closeSecondTab = closeSecondTab
exports.postTweet=postTweet
exports.getTweet=getTweet
exports.tweetsAction=tweetsAction
exports.getNotifications=getNotifications
exports.tabWait=tabWait
exports.reloadPage=reloadPage
exports.getAllUserCookie=getAllUserCookie
exports.doIHaveNewNotifications=doIHaveNewNotifications

