var config = new Object()
config.isHeadless = false;
config.isProduction = false // real mode: true

/* For twitterCommunicator */
// Get
config.realVerifyCredentials = true // real mode: true
config.returnStaticData = false // Real mode: false
config.returnStaticTweetData = false // Real mode: false
config.returnStaticUserLikesData = false // Real mode: false
config.returnStaticUserFollowersData = false // Real mode: false
config.returnStaticUserFriendsData = false // Real mode: false
config.returnStaticUserTimelineData = false // Real mode: false
config.returnStaticSearchTweetsData = false // Real mode: false
config.returnStaticSearchUsersData = false // Real mode: false

config.returnStaticFeed = false // Real mode: false
// Post
config.makeActionsInTwitter = true // Real mode: true
config.publishPostInTwitter = true // Real mode: true

// For Twitter inner API
config.numOfGuestTokens = 3

// Injection params
config.injectionParams = {
    updateTimeInMili: 1000 * 60 * 60 * 2, // 2 hours
    numUpdatesForIteration: 4,
    numTweetsToInject: 20,
    injectedTweetsSizeInDoc: 60,
    tweetsPerUser: 10,
    tweetsPerKeyword: 4
}


// Date formats
config.dateFormat = "MM/DD/YYYY HH:mm:ss UTC"


// Save selenium tabs in experiments
var HashMap = require('hashmap');
// Hashmap structure : {key = username, value = selenium tab}
config.tabsHashMap = new HashMap();

module.exports = config;