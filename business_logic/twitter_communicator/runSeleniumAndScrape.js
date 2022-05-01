var authorizeUser = require("./selenium_authorize/authorizeUser.js");
var scrapeTwitter = require("./scrape_process/scrapeTwitter.js");
var credentials = require("./static_twitter_data/CredentialsJSON.js");
const {Builder, By, Key, until} = require('selenium-webdriver');

async function userRun(user_credentials){
    var tab = await createNewTab();

    // Log in to twitter and get cookies
    await authorizeUser.logInProcess(user_credentials,tab, By, Key);

    // var whoToFollowElement = await scrapeTwitter.scrapeWhoToFollow(tab);
    // // console.log(whoToFollowElement);

    var n = 20;
    await scrapeTwitter.scrollPost(tab);
    var n_first_tweets = await scrapeTwitter.get_n_first_tweets(tab,n);
    
    // var arr = n_first_tweets;
    // arr = arr.concat(n_first_tweets);
    // console.log(arr);
}

async function createNewTab(){

    // Include the chrome driver
    require("chromedriver");
    // Include selenium webdriver
    let swd = require("selenium-webdriver");
    let browser = new swd.Builder();
    let tab = browser.forBrowser("chrome").build();
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
