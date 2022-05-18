var authorizeUser = require("./selenium_authorize/authorizeUser.js");
var scrapeTwitter = require("./scrape_process/scrapeTwitter.js");
var credentials = require("../twitter_communicator/static_twitter_data/CredentialsJSON.js");
const {Builder, By, Key, until} = require('selenium-webdriver');
const bcrypt = require("bcryptjs");
const { tabWait } = require("./scrape_process/scrapeTwitter.js");


async function userRun(user_credentials){
    let tab = await createNewTab();
    // Log in to twitter and get cookies
    await authorizeUser.logInProcess(user_credentials,tab, By, Key);

    await tabWait(tab,6000);
    var whoToFollowElement = await scrapeTwitter.scrapeWhoToFollow(tab);
    console.log(whoToFollowElement);


    var n_first_tweets = await scrapeTwitter.getFeed(tab);
    console.log(n_first_tweets);


    let tweet_username = "BenCaspit";
    let json_details = await scrapeTwitter.getProfileContent(tab,tweet_username);
    console.log(json_details);

}   

async function createNewTab(){

    // Include the chrome driver
    require("chromedriver");
    // Include selenium webdriver
    let swd = require("selenium-webdriver");
    let browser = new swd.Builder();
    // let tab = browser.forBrowser("chrome").build();
    const chrome = require('selenium-webdriver/chrome');

    // let tab = new Builder()
    // .forBrowser('chrome')
    // .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    // .build();

    let tab = new Builder().forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headless'))
    .build()
    
    // Define window size
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
