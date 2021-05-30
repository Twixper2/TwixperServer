const twitterInnerApiUtils = require("./twitterInnerApiUtils")
const config = require('../../../config.js')
const bearerToken = process.env.TWITTER_INNER_API_BEARER_TOKEN

const twitterInnerApiUrl = "https://twitter.com/i/api/2"
const getTweetParams = "include_profile_interstitial_type=1&include_blocking=1"
+"&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1"
+"&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12"
+"&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1"
+"&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true"
+"&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=false&count=20"
+"&include_ext_has_birdwatch_notes=false&include_ext_birdwatch_pivot=false"
const getUserTimelineParams = "include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1"
+"&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&"
+"include_can_media_tag=1&skip_status=1&include_cards=1&include_ext_alt_text=true&include_quote_count=true"
+"&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&"
+"include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&"
+"simple_quoted_tweet=true&include_tweet_replies=false" // When sending req, add &userId=... &count=...
const searchParams = "include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1"
+"&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1"
+"&include_can_media_tag=1&skip_status=1&include_ext_alt_text=true&include_quote_count=true"
+"&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true"
+"&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true"
+"&simple_quoted_tweet=true&query_source=typed_query&pc=1&spelling_corrections=1" // When sending req, add &count=...

const axios = require('axios')

const numOfGuestTokens = config.numOfGuestTokens
var guestTokensArr = []
var currGuestTokenIndex = 0
// Initializing guest tokens array
for (let i = 0; i < numOfGuestTokens; i++) {
    guestTokensArr.push(null)
}

async function getGuestToken(){
    let guestToken = guestTokensArr[currGuestTokenIndex]
    if(guestToken == null){
        guestTokensArr[currGuestTokenIndex] = await twitterInnerApiUtils.getGuestToken()
        guestToken = guestTokensArr[currGuestTokenIndex]
    }
    return guestToken
}

async function renewCurrGuestToken(){
    console.log("Renewing guest token")
    guestTokensArr[currGuestTokenIndex] = await twitterInnerApiUtils.getGuestToken()
}

async function createGuestHeaderObj(){
    let headerObj = {}
    // Set the bearer token
    headerObj['Authorization'] = 'Bearer ' + bearerToken
    // Ask for guest token
    const guestToken = await getGuestToken()
    headerObj['x-guest-token'] = guestToken
    return headerObj
}

async function sendGetRequestReturnResponse(requestUrl, options = {}, retries = 3){
    let success = false
    for (let i = 1; i <= retries; i++) {
        const isLastRetry = (i == retries)
        options.headers = await createGuestHeaderObj()
        const axiosReponse = await axios.get(requestUrl, options)
        .then(async function (response){
            if(response.status == 200){
                console.log("Success, updating the next guest token index")
                // Update the next token index
                currGuestTokenIndex = (currGuestTokenIndex + 1) % numOfGuestTokens
                success = true
                // Return the response
                return response
            }
            // If from some reason the response is successful with status != 200, try new guest token
            await renewCurrGuestToken()
        })
        .catch(async function (error) {
            if (error.response) {
                // Check if it is because the guest token is expired
                if(error.response.status){ // was 403 and then they changed to 401
                    await renewCurrGuestToken()
                }
                return error.response
            }
            else{ // This is network error
                console.log(error)
                return {status: 0, data: "Network error, server probably down"}
            }
        });
        if(success || isLastRetry){
            return axiosReponse
        }
    }
    
}

async function getTweet(tweetId){
    const url = twitterInnerApiUrl+"/timeline/conversation/" + tweetId + ".json?" + getTweetParams 
    const response = await sendGetRequestReturnResponse(url)
    if(response.status == 200){
        return response.data
    }
    else{
        throw (
            {
                description: "Error while getting tweet from inner api", 
                message: "inner-api-error"
            }
        )
    }
}

async function getTweetCommentsByCursor(tweetId, cursor){

}

async function getUserTimeline(userId, count=40){
    const url = twitterInnerApiUrl+"/timeline/profile/" + userId + ".json?" + getUserTimelineParams 
    + "&userid=" + userId + "&count=" + count
    const response = await sendGetRequestReturnResponse(url)
    if(response.status == 200){
        return response.data
    }
    else{
        throw (
            {
                description: "Error while getting user timeline from inner api", 
                message: "inner-api-error"
            }
        )
    }
}

async function searchTweets(query, count=40){
    const convertedQuery = encodeURIComponent(query)
    const url = twitterInnerApiUrl+"/search/adaptive.json?" + searchParams + "&q=" 
    + convertedQuery + "&count=" + count
    const response = await sendGetRequestReturnResponse(url)
    if(response.status == 200){
        return response.data
    }
    else{
        throw (
            {
                description: "Error while searching tweets from inner api", 
                message: "inner-api-error"
            }
        )
    }
}

async function searchUsers(query){
    const convertedQuery = encodeURIComponent(query)
    const url = twitterInnerApiUrl+"/search/adaptive.json?" + searchParams + "&result_filter=user&q=" + convertedQuery
    const response = await sendGetRequestReturnResponse(url)
    if(response.status == 200){
        return response.data
    }
    else{
        throw (
            {
                description: "Error while searching users from inner api", 
                message: "inner-api-error"
            }
        )
    }
}

exports.getTweet = getTweet
exports.getUserTimeline = getUserTimeline
exports.searchTweets = searchTweets
exports.searchUsers = searchUsers