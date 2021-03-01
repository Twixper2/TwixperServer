// twit package: https://github.com/ttezel/twit

/* err object when omitted:
    {
        message:      '...',  // error message
        statusCode:   '...',  // statusCode from Twitter
        code:         '...',  // error code from Twitter (for example 88 is "Rate limit exceeded")
        twitterReply: '...',  // raw response data from Twitter
        allErrors:    '...'   // array of errors returned from Twitter
    }
    see twitter api errors: https://developer.twitter.com/ja/docs/basics/response-codes
*/

function sendPostRequestReturnResponse(T, apiEndpoint, params, successCallback, errorCallback){
    T.post(apiEndpoint, params, function(err, data, response) {
        if(err){
            errorCallback(err) // See error object at the top of this file
        }
        successCallback(data)
    })
}

function sendPostRequestsWrapper(T, apiEndpoint, params){
    return new Promise((resolve, reject) => {
        sendPostRequestReturnResponse(T, apiEndpoint, params,(successResponse) => {
            resolve(successResponse);
        }, (errorResponse) => {
            reject(errorResponse);
        });
    });
}

async function likeTweet(T, tweetId){ 
    const params = {
        id: tweetId,
    }
    return await sendPostRequestsWrapper(T, "favorites/create", params)
}

async function unlikeTweet(T, tweetId){ 
    const params = {
        id: tweetId,
    }
    return await sendPostRequestsWrapper(T, "favorites/destroy", params)
}

async function publishTweet(T, tweetParams){ 
    return await sendPostRequestsWrapper(T, "statuses/update", tweetParams)
}

exports.likeTweet = likeTweet
exports.unlikeTweet = unlikeTweet
exports.publishTweet = publishTweet