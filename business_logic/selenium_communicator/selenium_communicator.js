const { query } = require("express");
const scrapeTwitter = require("../selenium_communicator/scrape_process/scrapeTwitter.js")
const scrapeTwitter_moshe = require("../selenium_communicator/scrape_process/scrapeTwitter_moshe")
const homepage_url = "https://twitter.com/home";
// const database = require("../../db/DBCommunicator.js");

async function redirectToHomePageIfNeeded(tab){
    if(await tab.getCurrentUrl() !== homepage_url){
        await tab.get(homepage_url);
        await scrapeTwitter.tabWait(tab,1000);
    }
}

async function scrapeWhoToFollow(tab){
    await redirectToHomePageIfNeeded(tab);
    return await scrapeTwitter.scrapeWhoToFollow(tab);
}

async function getUserEntityData(tab){
    return await scrapeTwitter.getUserEntityData(tab);
}

async function getFeed(tab){
    await redirectToHomePageIfNeeded(tab);
    await scrapeTwitter.scrollPost(tab);
    return await scrapeTwitter.getFeed(tab);
}

async function getProfileContent(tab,tweet_username){
    return await scrapeTwitter_moshe.getProfileContent(tab,tweet_username);
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
exports.scrapeWhoToFollow = scrapeWhoToFollow
exports.getFeed = getFeed
exports.getProfileContent = getProfileContent
exports.getTop_TweetsSearchResult = getTop_TweetsSearchResult
exports.getLatest_TweetsSearchResult = getLatest_TweetsSearchResult
exports.getPeople_SearchResult = getPeople_SearchResult
exports.newTweetsSearch = newTweetsSearch
exports.newPeopleSearch = newPeopleSearch

exports.getMoreSearchResult = getMoreSearchResult
exports.closeSecondTab = closeSecondTab
exports.postTweet=postTweet