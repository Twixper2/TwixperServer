const axios = require('axios')
const oauth1Helper = require("./oauth1Helper")

async function sendPostRequestReturnResponse(requestUrl, header, payload){
    return await axios.post(requestUrl, payload, { headers: header })
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
}

async function requestToken(oathCallback){
    const requestData = {
        url: 'https://api.twitter.com/oauth/request_token',
        method: 'POST',
        data: { 
            oauth_callback: oathCallback,
        },
    }
    const authHeader = oauth1Helper.getAuthHeaderForRequest(requestData);
    return await sendPostRequestReturnResponse(requestData.url, authHeader, {})
}

async function accessToken(token, verifier){   
    const requestUrl = "https://api.twitter.com/oauth/access_token?oauth_token=" + token + "&oauth_verifier=" + verifier
    return await sendPostRequestReturnResponse(requestUrl, {}, {})
}


exports.requestToken = requestToken
exports.accessToken = accessToken