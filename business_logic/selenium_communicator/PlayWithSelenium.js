var authorizeUser = require('./selenium_authorize/authorizeUser.js');
var scrapeTwitter = require('./scrape_process/scrapeTwitter.js');
var { user_credentials } = require('../../business_logic/twitter_communicator/static_twitter_data/ConstantsJSON.js');
const { Builder, By, Key, until } = require('selenium-webdriver');
const manipulator = require('../participant/manipulator/manipulator.js');
// const participantsService_selenium = require("../../service/participants/participantsService_selenium.js");
const participantAuthUtils_selenium = require('../../business_logic/participant/participant_auth_utils/participantAuthUtils_selenium.js');
const selenium_communicator = require('./selenium_communicator.js');

async function userRun(user_cred) {
  // Define participant arg' for manipulation
  const participant1 = {
    exp_id: '102',
    group_id: 11,
    participant_twitter_username: 'yossi',
    participant_twitter_name: 'Yossi',
    participant_twitter_friends_count: 84,
    participant_twitter_followers_count: 11,
    participant_twitter_profile_image: 'https://pbs.twimg.com/profile_images/1327926340046229505/-XM4INec_normal.jpg',
    participant_email: 'gmail@gmail.com',
    group_manipulations: [
      {
        type: 'mute',
        users: [],
        keywords: [],
      },
      {
        type: 'inject',
        users: [],
        keywords: [],
      },
      {
        type: 'pixel_media',
        users: ['elonmusk'],
        keywords: ['?'],
      },
      {
        type: 'remove_media',
        users: [],
        keywords: [],
      },
    ],
  };

  let tab = await participantAuthUtils_selenium.createNewTab();
  // Log in to twitter and get cookies
  await authorizeUser.logInProcess(user_cred, tab, By, Key);
  // if (n_first_tweets) {
  // n_first_tweets = await manipulator.manipulateTweets(participant1, n_first_tweets)
  // }

  let tweet_username = 'benyshlomo';
  let tweet_id_str = '1538068020655947776';
  // console.log(await selenium_communicator.scrapeWhoToFollow(tab));
  let x = await selenium_communicator.getFeed(tab);
  console.log(x);
  // console.log(await selenium_communicator.getUserEntityDetails(tab,tweet_username));
  // console.log(await selenium_communicator.getUserTimeline(tab,tweet_username));
  // console.log(await selenium_communicator.getUserLikes(tab,tweet_username));
  // console.log(await selenium_communicator.getTweet(tab,tweet_username,tweet_id_str));
}

async function main() {
  // Retrieve user credentials

  // var credentials_1 = credentials.credentials_1;
  // await userRun(credentials_1);

  // Retrieve user credentials
  let correct = user_credentials.correct_credentials;
  let incorrect = user_credentials.incorrect_credentials;
  var credentials_2 = correct.credentials_2;
  var credentials_4 = incorrect.credentials_3;
  var credentials_3 = incorrect.credentials_4;
  await userRun(credentials_2);
}

main();
