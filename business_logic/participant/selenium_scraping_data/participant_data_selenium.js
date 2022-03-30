const scrapeTwitter = require("../../twitter_communicator/scrape_process/scrapeTwitter")
const database = require("../../db/DBCommunicator.js");


async function scrapeWhoToFollow(tab){
    const whoToFollowElement = await scrapeTwitter.scrapeWhoToFollow(tab);
    return whoToFollowElement;
}


exports.scrapeWhoToFollow = scrapeWhoToFollow
