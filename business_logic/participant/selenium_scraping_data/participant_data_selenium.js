const scrapeTwitter = require("../../twitter_communicator/scrape_process/scrapeTwitter")
const database = require("../../db/DBCommunicator.js");


async function scrapeWhoToFollow(tab){
    const whoToFollowElement = await scrapeTwitter.scrapeWhoToFollow(tab);
    return whoToFollowElement;
}

async function get_n_first_tweets(tab,n){
    const get_n_first_tweets = await scrapeTwitter.get_n_first_tweets(tab,n);
    return get_n_first_tweets;
}


exports.scrapeWhoToFollow = scrapeWhoToFollow
exports.get_n_first_tweets = get_n_first_tweets
