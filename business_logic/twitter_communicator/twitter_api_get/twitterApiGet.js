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

function sendGetRequestReturnResponse(T, apiEndpoint, params, successCallback, errorCallback){
    T.get(apiEndpoint, params, function(err, data, response) {
        if(err){
            errorCallback(err) // See error object at the top of this file
        }
        successCallback(data)
    })
}

function sendGetRequestsWrapper(T, apiEndpoint, params){
    return new Promise((resolve, reject) => {
        sendGetRequestReturnResponse(T, apiEndpoint, params,(successResponse) => {
            resolve(successResponse);
        }, (errorResponse) => {
            reject(errorResponse);
        });
    });
}

async function getFeed(T){ // Add additional request parameters later
    const params = {
        tweet_mode: "extended",
        count: 40
    }
    return await sendGetRequestsWrapper(T, "statuses/home_timeline", params)
}

exports.getFeed = getFeed