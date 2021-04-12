/*
    __  ______    _   __________  __  ____    ___  __________  ____ 
   /  |/  /   |  / | / /  _/ __ \/ / / / /   /   |/_  __/ __ \/ __ \  TM
  / /|_/ / /| | /  |/ // // /_/ / / / / /   / /| | / / / / / / /_/ /
 / /  / / ___ |/ /|  // // ____/ /_/ / /___/ ___ |/ / / /_/ / _, _/ 
/_/  /_/_/  |_/_/ |_/___/_/    \____/_____/_/  |_/_/  \____/_/ |_|  

                            By Twixper
 */


function manipulateTweets(manipulations, tweets, participantUsername){
    let manipulatedTweets = tweets
    const muteManipulation = manipulations.find(man => man.type == "mute") 
    if (muteManipulation!= null){
        manipulatedTweets = muteTweets(muteManipulation, manipulatedTweets, participantUsername)
    }
    return manipulatedTweets
}

function muteTweets(muteManipulation, tweets, participantUsername){
    const usersToMute = muteManipulation.users
    const keywordsToMute = prepareKeywords(muteManipulation.keywords)
    
    /*
    "entities":{
        "hashtags": [
            {
                "text": "THFC",
                "indices": [
                    94,
                    99
                ]
            },
        ],
        "user_mentions": [
            {
                "screen_name": "premierleague",
                "name": "Premier League",
                "id": 343627165,
                "id_str": "343627165",
                "indices": [
                    73,
                    87
                ]
            }
        ],
    }
    */

    const keywordsRegexes = getRegexesFromKeywords(keywordsToMute)
    let filteredTweets = []
    for (let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i];
        if(!isTweetMatchToManipulation(tweet, usersToMute, keywordsToMute,
            keywordsRegexes, participantUsername)){
            
            /*  The tweet is not matching the given keywords and users in the manipulation,
                now decide what to do with it. In this case, we want to add the tweet to
                the feed if the tweet should not be muted  */
            filteredTweets.push(tweet)
        }
    }
    return filteredTweets
}

/*
    Checks if a tweet contains one of the keyords,
    or was written by one of the users, and NOT mentioned the participant.
    Returns true or false
*/
function isTweetMatchToManipulation(tweet, usersManip, keywords, keywordsRegexes, pUsername){
    const entities = tweet.entities
    /*  If the participant is the author of the tweet
        or is mentioned in the tweet, we do not want to manipulate the tweet. */
    if(isUserMentioned(entities.user_mentions, pUsername)){
        return false
    }
    const user = tweet.user
    const tweetAuthorName = user.screen_name
    if(pUsername == tweetAuthorName){
        // The participant is the author of the tweet
        return false
    }


    if(usersManip.includes(tweetAuthorName)){
        // One of the users in the manipulation wrote this tweet
        return true
    }

    if(isKeywordsInHashtags(entities.hashtags, keywords)){
        // One of the hashtags in the tweet is in the keywords
        return true
    }

    const tweetText = tweet.full_text
    if(isRegexesInText(tweetText, keywordsRegexes)){
        // The tweet's text contains one of the keywords
        return true
    }

    // Check if it is a retweet
    if(tweet.retweeted_status && tweet.retweeted_status){
        const original = tweet.retweeted_status

        const originalUser = original.user
        if(usersManip.includes(originalUser.screen_name)){ 
            // This is a retweet and one of the users in the manipulation wrote the ORIGINAL tweet
            return true
        }

        const originalEntities = original.entities
        if(isKeywordsInHashtags(originalEntities.hashtags, keywords)){
            // One of the hashtags in the original tweet is in the keywords
            return true
        }
        
        const originalText = original.full_text
        if(isRegexesInText(originalText, keywordsRegexes)){
            // The original tweet's text contains one of the keywords
            return true
        }
    }

    // Check if it is a quote
    if(tweet.is_quote_status === true && tweet.quoted_status){
        const quoted = tweet.quoted_status

        const quotedUser = quoted.user
        if(usersManip.includes(quotedUser.screen_name)){ 
            // This is a quote and one of the users in the manipulation wrote the quoted tweet
            return true
        }

        const quotedEntities = quoted.entities
        if(isKeywordsInHashtags(quotedEntities.hashtags, keywords)){
            // One of the hashtags in the quoted tweet is in the keywords
            return true
        }
        
        const quotedText = quoted.full_text
        if(isRegexesInText(quotedText, keywordsRegexes)){
            // The quoted tweet's text contains one of the keywords
            return true
        }
    }

    return false
}

function prepareKeywords(keywords){
    // Removes first '#' if exists
    for (let i = 0; i < keywords.length; i++) {
        const keyword = keywords[i];
        if(keyword[0] == '#'){
            keywords[i] = keyword.substring(1)
        }
    }
    return keywords
}

function isUserMentioned(userMentioned, username){
    userMentioned.forEach(obj => {
        if(obj.screen_name == username){
            return true
        }
    });
    return false
}

function isKeywordsInHashtags(hashtags, keywords){
    hashtags.forEach(obj => {
        if(keywords.includes(obj.text)){
            return true
        }
    });
    return false
}

function isRegexesInText(text, regexes){
    const contains = (regex) => {
        return new RegExp(regex, "i").test(text);
    }
    return regexes.some(contains)
}

/* Should call this one time */
function getRegexesFromKeywords(keywords){
    let regexes = []
    keywords.forEach(keyword => {
        let regex = '\\b';
        regex += escapeRegExp(keyword);
        regex += '\\b';
        regexes.push(regex)
    });
    return regexes
}

/* In case a keyword contains special regex characters */
function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
  

exports.manipulateTweets = manipulateTweets
