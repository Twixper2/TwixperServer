const scrapeTwitter = require("../selenium_communicator/scrape_process/scrapeTwitter.js")
const scrapeTwitter_moshe = require("../selenium_communicator/scrape_process/scrapeTwitter_moshe")

// const database = require("../../db/DBCommunicator.js");

async function scrapeWhoToFollow(tab){
    return await scrapeTwitter.scrapeWhoToFollow(tab);
}

async function getUserEntityData(tab){
    return await scrapeTwitter.getUserEntityData(tab);
}

async function getFeed(tab){
    await scrapeTwitter.scrollPost(tab);
    return await scrapeTwitter.getFeed(tab);
}

exports.scrapeWhoToFollow = scrapeWhoToFollow
exports.getFeed = getFeed
