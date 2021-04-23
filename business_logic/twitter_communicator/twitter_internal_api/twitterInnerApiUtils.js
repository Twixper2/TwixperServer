const AZURE_GET_GUEST_TOKEN_FUNC_URL = process.env.AZURE_GET_GUEST_TOKEN_FUNC_URL
const axios = require('axios')

async function getGuestToken(){
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
        // No need to format, already formatted
        return tweetPage
    }
    const tweets = tweetPage.globalObjects.tweets
    const users = tweetPage.globalObjects.users
    // Find the specified tweet 
    let formattedTweetPage = buildTweetObj(tweetId, tweets, users)

    // If this is a quote, find and attach the original quote and his author
    if(formattedTweetPage.is_quote_status == true){
        const qTweetId = formattedTweetPage.quoted_status_id_str
        formattedTweetPage.quoted_status = buildTweetObj(qTweetId, tweets, users)
    }

    // If this is a retweet, find and attach the original tweet and his author
    if(formattedTweetPage.retweeted_status_id_str != null){
        const rTweetId = formattedTweetPage.retweeted_status_id_str
        formattedTweetPage.retweeted_status = buildTweetObj(rTweetId, tweets, users)
    }
    
    // TODO: Add the 'comments' field

    return formattedTweetPage
}

function buildTweetObj(tweetId, tweets, users){
    // Find the specified tweet 
    let tweet = tweets[tweetId]
    // Find the author of the tweet and attach him
    const userId = tweet.user_id_str
    tweet.user = users[userId]
    return tweet
}

exports.getGuestToken = getGuestToken
exports.formatTweetPageObject = formatTweetPageObject
