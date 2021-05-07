var config = new Object()

config.isProduction = true // real mode: true

/* For twitterCommunicator */
// Get
config.realVerifyCredentials = true // real mode: true
config.returnStaticData = true // Real mode: false
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

// Date formats
config.dateFormat = "MM/DD/YYYY HH:mm:ss UTC"

module.exports = config;