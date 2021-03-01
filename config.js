var config = new Object()

/* For twitterCommunicator */
// Get
config.realVerifyCredentials = true // real mode: true
config.returnStaticData = true // Real mode: false
config.returnStaticFeed = false // Real mode: false
// Post
config.makeActionsInTwitter = true // Real mode: true
config.publishPostInTwitter = true // Real mode: true

module.exports = config;