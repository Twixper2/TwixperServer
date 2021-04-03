var config = new Object()

config.isProduction = false // real mode: true

/* For twitterCommunicator */
// Get
config.realVerifyCredentials = true // real mode: true
config.returnStaticData = true // Real mode: false
config.returnStaticFeed = false // Real mode: false
// Post
config.makeActionsInTwitter = true // Real mode: true
config.publishPostInTwitter = true // Real mode: true

// Date formats
config.dateFormat = "MM/DD/YYYY HH:mm:ss"

module.exports = config;