var authorizeUser = require("./selenium_authorize/authorizeUser.js");
var scrapeTwitter = require("./scrape_process/scrapeTwitter.js");
var credentials = require("../twitter_communicator/static_twitter_data/CredentialsJSON.js");
const {Builder, By, Key, until} = require('selenium-webdriver');
const bcrypt = require("bcryptjs");
const { tabWait } = require("./scrape_process/scrapeTwitter.js");
const manipulator = require("../participant/manipulator/manipulator.js");


async function userRun(user_credentials){
    let tab = await createNewTab();
    // Log in to twitter and get cookies
    await authorizeUser.logInProcess(user_credentials,tab, By, Key);

    // let whoToFollowElement = await scrapeTwitter.scrapeWhoToFollow(tab);
    // console.log(whoToFollowElement);


    // Define participant arg' for manipulation
    const participant1 = {
        "exp_id": "102",
        "group_id": 11,
        "participant_twitter_username": "yossi",
        "participant_twitter_name": "Yossi",
        "participant_twitter_friends_count": 84,
        "participant_twitter_followers_count": 11,
        "participant_twitter_profile_image": "https://pbs.twimg.com/profile_images/1327926340046229505/-XM4INec_normal.jpg",
        "participant_email": "gmail@gmail.com",
        "group_manipulations": [{
            "type": "mute",
            "users": [],
            "keywords": []
        }, {
            "type": "inject",
            "users": [],
            "keywords": []
        }, {
            "type": "pixel_media",
            "users": ["elonmusk"],
            "keywords": ["?"]
        }, {
            "type": "remove_media",
            "users": [],
            "keywords": []
        }]
    }
    await tabWait(tab,8000);


    
    let n_first_tweets = await scrapeTwitter.getFeed(tab);
    // if (n_first_tweets) {
    //     n_first_tweets = await manipulator.manipulateTweets(participant1, n_first_tweets)
    // }

    console.log(n_first_tweets);

    // console.log(await scrapeTwitter.scrapeWhoToFollow(tab));

    // let tweet_username = "elonmusk";
    // let json_details = await scrapeTwitter.getProfileContent(tab,tweet_username);

    // console.log(json_details);

}   

async function createNewTab(){

    // Include selenium webdriver
    require('chromedriver');
    let swd = require("selenium-webdriver");
    let browser = new swd.Builder();
    let tab = browser.forBrowser("chrome").build();
    tab.manage().window().maximize();
    return tab;
}


async function main(){
    // Retrieve user credentials

    // var credentials_1 = credentials.credentials_1;
    // await userRun(credentials_1);

    // Retrieve user credentials
    var credentials_2 = credentials.credentials_2;
    await userRun(credentials_2);
}

main();
