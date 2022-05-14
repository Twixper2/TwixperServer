const scrapeTwitter = require("../selenium_communicator/scrape_process/scrapeTwitter.js")
const scrapeTwitter_moshe = require("../selenium_communicator/scrape_process/scrapeTwitter_moshe")
const homepage_url = "https://twitter.com/i/flow/login";

// const database = require("../../db/DBCommunicator.js");

async function scrapeWhoToFollow(tab){
    return await scrapeTwitter.scrapeWhoToFollow(tab);
}

async function getUserEntityData(tab){
    return await scrapeTwitter.getUserEntityData(tab);
}

async function getFeed(tab){
    // await tab.get(homepage_url);
    await scrapeTwitter.scrollPost(tab);
    return await scrapeTwitter.getFeed(tab);
}

async function getProfileContent(tab,tweet_username){
    return await scrapeTwitter.getProfileContent(tab,tweet_username);
}

exports.scrapeWhoToFollow = scrapeWhoToFollow
exports.getFeed = getFeed
exports.getProfileContent = getProfileContent
