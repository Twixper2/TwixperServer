const crypto = require('crypto');
const oauth1a = require('oauth-1.0a');

const CONSUMERKEY = process.env.API_KEY;
const CONSUMERSECRET = process.env.API_SECRET_KEY;
// const TOKENKEY = '<tokenKey>';
// const TOKENSECRET = '<tokenSecret>';

const oauth = oauth1a({
    consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
})

function getAuthHeaderForRequest(requestData, tokenKey=null, tokenSecret=null) {
    if(tokenKey == null || tokenSecret == null){
        return oauth.toHeader(oauth.authorize(requestData))
    }

    const authorization = oauth.authorize(requestData, {
        key: tokenKey,
        secret: tokenSecret,
    });

    return oauth.toHeader(authorization);
}

exports.getAuthHeaderForRequest = getAuthHeaderForRequest;