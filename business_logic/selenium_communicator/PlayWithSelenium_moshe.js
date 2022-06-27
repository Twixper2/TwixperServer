var authorizeUser = require("./selenium_authorize/authorizeUser.js");
var participantsService_selenium = require("../../service/participants/participantsService_selenium.js");

var scrapeTwitter_moshe = require("./scrape_process/scrapeTwitter_moshe.js");
var credentials = require("../twitter_communicator/static_twitter_data/CredentialsJSON.js");
const twitterInnerApiGet = require("../twitter_communicator/twitter_internal_api/twitterInnerApiGet")
const homepage_url = "https://twitter.com/home";


const {Builder, By, Key, until} = require('selenium-webdriver');
var TweetsGlobalVariable = 0
async function userRun(user_credentials){
    // let tab = await createNewTab();

    // Log in to twitter and get cookies
    // await authorizeUser.logInProcess(user_credentials,tab, By, Key);
    // await authorizeUser.userLogInReq(user_credentials,tab, By, Key);

    // -----------------------open second web driver with user cookies------------------------------------
    // let tab =await authorizeUser.loadUserCookie(await createNewTab(),user_credentials.user);
    // await tab.get(homepage_url);

    // var tweet_id = "1530516552084234244";
    // var user_url = "elonmusk";
    // // data-testid="unretweet"
    // var action_1 = "like";
    // let result =  await scrapeTwitter_moshe.tweetsActionManager(tab,tweet_id,user_url,action_1)
    // console.log(result);
    // var reply= "hello elonmusk! my name is Twixper";
    // var action_2 = "reply";
    // result =  await scrapeTwitter_moshe.tweetsActionManager(tab,tweet_id,user_url,action_2,reply)
    // console.log(result);
    // var action_3 = "retweet";
    // result =  await scrapeTwitter_moshe.tweetsActionManager(tab,tweet_id,user_url,action_3,reply)
    // console.log(result);
    // var action_4 = "like";
    // result =  await scrapeTwitter_moshe.tweetsActionManager(tab,tweet_id,user_url,action_4,reply)
    // console.log(result);
    //------------------------------------------ getNotifications ------------------------------------------

    // let searchResult1 = await scrapeTwitter_moshe.doIHaveNewNotifications(tab);
    // let searchResult1 = await scrapeTwitter_moshe.getNotifications(tab);
    // searchResult1 = twitterInnerApiGet.searchUsers("moshe");
    // console.log(searchResult1);



    //------------------------------------------ search ------------------------------------------
    // let q = "ukraine";
    // let mode="live"
    // let searchResult1 = await scrapeTwitter_moshe.searchTwitterTweets(tab,q,mode);
    // let searchResult = await scrapeTwitter_moshe.searchTwitterPeople(tab,q);
    // console.log(searchResult1.length);

    ////------------------------------------------ post ------------------------------------------
    // var tweet = "hello world! 📢";
    // await scrapeTwitter_moshe.postTweets(tab,tweet);
    // let n = 20;
    // var n_first_tweets = await scrapeTwitter_moshe.get_n_first_tweets(tab,n);
    // var whoToFollowElement = await scrapeTwitter_moshe.scrapeWhoToFollow(tab);
    // let tweet_username = "BenCaspit";
    // let json_details = await scrapeTwitter_moshe.getProfileContent(tab,tweet_username,n);
    // console.log(json_details);
    // let y=3;

    let test = await participantsService_selenium.checkForPushNotifications();

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
    var credentials_2 = credentials.credentials_1;
    await userRun(credentials_2);
}

main();
