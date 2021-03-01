const manipulator = require("./manipulator.js")

// Testing
const manipulations = [
    {
        "type":'mute',
        "users": ['realDonaldTrump']
    }
]

const tweets = require("./dataForTests").tweets
const participantUsername = "twixperApp"

const manTweets = manipulator.manipulateTweets(manipulations, tweets, participantUsername)
manTweets.forEach(tweet => {
    console.log(tweet.id_str)
});
