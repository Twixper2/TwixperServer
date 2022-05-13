const scrapeTwitter = require("../../twitter_communicator/scrape_process/scrapeTwitter")
const scrapeTwitter_moshe = require("../../twitter_communicator/scrape_process/scrapeTwitter_moshe")

// const database = require("../../db/DBCommunicator.js");


async function scrapeWhoToFollow(tab){
    const whoToFollowElement = await scrapeTwitter.scrapeWhoToFollow(tab);
    return whoToFollowElement;
}

async function get_n_first_tweets(tab){
    await scrapeTwitter.scrollPost(tab);
    const get_n_first_tweets = await scrapeTwitter.get_n_first_tweets(tab);
    return get_n_first_tweets;
}

// async function search_moshe(tab){
//     const get_n_first_tweets = await scrapeTwitter_moshe.get_n_first_tweets(tab);
//     return get_n_first_tweets;
// }


exports.scrapeWhoToFollow = scrapeWhoToFollow
exports.get_n_first_tweets = get_n_first_tweets
