var authorizeUser = require("./selenium_authorize/authorizeUser.js");
var scrapeTwitter = require("./scrape_process/scrapeTwitter.js");
var credentials = require("./static_twitter_data/CredentialsJSON.js");
const {By, Key} = require('selenium-webdriver');

async function userRun(user_credentials){
    var tab = await createNewTab();

    // Log in to twitter and get cookies
    var cookies = await authorizeUser.logInProcess(user_credentials,tab, By, Key);

    var whoToFollowElement = await scrapeTwitter.scrapeWhoToFollow(tab);
    // // console.log(whoToFollowElement);
    // var n = 5;
    // var n_first_tweets = await scrapeTwitter.get_n_first_tweets(tab,n);
    // console.log(n_first_tweets);


    

    // Next - send cookies to beautifulsoup in Python
    // var port = 5502;
    // await scrapeTwitter.dataTransformationToScrape(port,cookies);
}

async function createNewTab(){

    const {Builder, By, Key, until} = require('selenium-webdriver');
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
