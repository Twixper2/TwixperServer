const AZURE_GET_GUEST_TOKEN_FUNC_URL = process.env.AZURE_GET_GUEST_TOKEN_FUNC_URL
const axios = require('axios')

async function getGuestToken(){
    console.log("Asking for a new guest token")
    const response = await axios.get(AZURE_GET_GUEST_TOKEN_FUNC_URL)
        .catch(function (error) {
            if (error.response) { 
                console.log(error.response)
                throw error.response
            }
            else{ // This is network error
                console.log(error)
                throw error
            }
        });
    return response.data.guest_token
}

/**
 * Format a tweet page object to the public api format.
 * Adds the field "comments" with the comments on the tweet
 * @param {Object} tweet The tweet page object
 */
function formatTweetPageObject(tweetPage, tweetId){
    if(!tweetPage.globalObjects){
        // No need to format, already formatted (probably this obj is from the official api response)
        return tweetPage
    }
    const tweets = tweetPage.globalObjects.tweets
    const users = tweetPage.globalObjects.users
    let formattedTweetPage = getFormattedTweet(tweetId, tweets, users)
    
    // Add the 'comments' field
    const commentsArr = formatTweetComments(tweetPage)
    formattedTweetPage.comments = commentsArr

    return formattedTweetPage
}

function formatUserTimelineObject(userTimelineObject){
    if(!userTimelineObject.globalObjects){
        // No need to format, already formatted (probably this obj is from the official api response)
        return userTimelineObject
    }
    let formattedTimelineTweets = []
    const tweets = userTimelineObject.globalObjects.tweets
    const users = userTimelineObject.globalObjects.users
    const entriesArr = userTimelineObject.timeline.instructions[0].addEntries.entries
    entriesArr.forEach(entry => {
        const entryId = entry.entryId
        if(entryId.startsWith("tweet")){
            // const tweetId = entry.content.item.content.tweet.id
            const dashIndex = entryId.indexOf("-")
            const tweetId = entryId.substring(dashIndex + 1)
            try{
                const formattedTweet = getFormattedTweet(tweetId, tweets, users)
                formattedTimelineTweets.push(formattedTweet)
            }
            catch(e){
                console.log("tweet " + tweetId + " is deleted or broken")
            }
        }
    });
    return formattedTimelineTweets
}


function getFormattedTweet(tweetId, tweets, users){
    // Find the specified tweet 
    let formattedTweet = buildTweetObj(tweetId, tweets, users)

    // If this is a quote, find and attach the original quote and his author
    if(formattedTweet.is_quote_status == true){
        const qTweetId = formattedTweet.quoted_status_id_str
        formattedTweet.quoted_status = buildTweetObj(qTweetId, tweets, users)
    }

    // If this is a retweet, find and attach the original tweet and his author
    if(formattedTweet.retweeted_status_id_str != null){
        const rTweetId = formattedTweet.retweeted_status_id_str
        let rTweet =  buildTweetObj(rTweetId, tweets, users)
        // Check if there is a quote inside the retweet
        if(rTweet.is_quote_status == true){
            const qRTweetId = rTweet.quoted_status_id_str
            rTweet.quoted_status = buildTweetObj(qRTweetId, tweets, users)
        }
        formattedTweet.retweeted_status = rTweet
    }
    return formattedTweet
}

function buildTweetObj(tweetId, tweets, users){
    // Find the specified tweet 
    let tweet = tweets[tweetId]

    // Find the author of the tweet and attach him
    const userId = tweet.user_id_str
    tweet.user = users[userId]
    return tweet
}

function formatTweetComments(tweetObj){
    const tweets = tweetObj.globalObjects.tweets
    const users = tweetObj.globalObjects.users
    let commentsArr = []
    const entriesArr = tweetObj.timeline.instructions[0].addEntries.entries
    entriesArr.forEach(entry => {
        const entryId = entry.entryId
        if(entryId.startsWith("conversationThread")){
            const dashIndex = entryId.indexOf("-")
            const tweetId = entryId.substring(dashIndex + 1)
            try{
                const formattedTweet = getFormattedTweet(tweetId, tweets, users)
                commentsArr.push(formattedTweet)
            }
            catch(e){ // Sometimes the comment is actually deleted
                console.log("comment " + tweetId + " is deleted or broken")
            }
        }
    });
    return commentsArr
}

function formatSearchTweetsObject(searchTweetsObj){
    if(!searchTweetsObj.globalObjects){
        // No need to format, already formatted (probably this obj is from the official api response)
        return searchTweetsObj
    }
    let formattedTweets = []
    const tweets = searchTweetsObj.globalObjects.tweets
    const users = searchTweetsObj.globalObjects.users
    const entriesArr = searchTweetsObj.timeline.instructions[0].addEntries.entries
    entriesArr.forEach(entry => {
        const entryId = entry.entryId
        if(entryId.startsWith("sq-I-t")){
            const dashIndex = entryId.lastIndexOf("-")
            const tweetId = entryId.substring(dashIndex + 1)
            try{
                const formattedTweet = getFormattedTweet(tweetId, tweets, users)
                formattedTweets.push(formattedTweet)
            }
            catch(e){
                console.log("tweet " + tweetId + " is deleted or broken")
            }
        }
    });
    return formattedTweets
}

function formatSearchUsersObject(searchUsersObj){
    if(!searchUsersObj.globalObjects){
        // No need to format, already formatted (probably this obj is from the official api response)
        return searchUsersObj
    }
    let formattedUsers = []
    const users = searchUsersObj.globalObjects.users
    const entriesArr = searchUsersObj.timeline.instructions[0].addEntries.entries
    entriesArr.forEach(entry => {
        const entryId = entry.entryId
        if(entryId.startsWith("sq-I-u")){
            const dashIndex = entryId.lastIndexOf("-")
            const userId = entryId.substring(dashIndex + 1)
            const formattedUser = users[userId]
            formattedUsers.push(formattedUser)
        }
    });
    return formattedUsers
}

exports.getGuestToken = getGuestToken
exports.formatTweetPageObject = formatTweetPageObject
exports.formatUserTimelineObject = formatUserTimelineObject
exports.formatTweetComments = formatTweetComments
exports.formatSearchTweetsObject = formatSearchTweetsObject
exports.formatSearchUsersObject = formatSearchUsersObject
