/*
    __  ______    _   __________  __  ____    ___  __________  ____ 
   /  |/  /   |  / | / /  _/ __ \/ / / / /   /   |/_  __/ __ \/ __ \  TM
  / /|_/ / /| | /  |/ // // /_/ / / / / /   / /| | / / / / / / /_/ /
 / /  / / ___ |/ /|  // // ____/ /_/ / /___/ ___ |/ / / /_/ / _, _/ 
/_/  /_/_/  |_/_/ |_/___/_/    \____/_____/_/  |_/_/  \____/_/ |_|  

                            By Twixper
 */

const utils = require("./manipulatorUtils")
const params = require("../../../config").injectionParams

async function manipulateTweets(participant, tweets){
    const manipulations = participant.group_manipulations
    const participantUsername = participant.participant_twitter_username
    let manipulatedTweets = tweets
    const muteManipulation = manipulations.find(man => man.type == "mute")
    const pixelMediaManipulation = manipulations.find(man => man.type == "pixel_media")
    const removeMediaManipulation = manipulations.find(man => man.type == "remove_media")
    const injectManipulation = manipulations.find(man => man.type == "inject")
    if(injectManipulation != null && (injectManipulation.users.length > 0 || injectManipulation.keywords.length > 0)){
        manipulatedTweets = await injectTweets(participant, manipulatedTweets)
    }
    if (muteManipulation != null && (muteManipulation.users.length > 0 || muteManipulation.keywords.length > 0)){
        manipulatedTweets = muteTweets(muteManipulation, manipulatedTweets, participantUsername)
    }
    if (removeMediaManipulation != null && (removeMediaManipulation.users.length > 0 || removeMediaManipulation.keywords.length > 0)){
        manipulatedTweets = removeMediaFromTweets(removeMediaManipulation, manipulatedTweets, participantUsername)
    }
    if (pixelMediaManipulation != null && (pixelMediaManipulation.users.length > 0 || pixelMediaManipulation.keywords.length > 0)){
        manipulatedTweets = pixelMediaInTweets(pixelMediaManipulation, manipulatedTweets, participantUsername)
    }
    
    return manipulatedTweets
}

async function injectTweets(participant, currTweets){
    const expId = participant.exp_id
    const groupId = participant.group_id
    let injectionDoc = await utils.getInjectionDoc(expId, groupId)
    const tweetsToInject = injectionDoc.tweets_to_inject
    let entitiesStates = injectionDoc.entities_states
    const feedLenBeforeInjection = currTweets.length
    currTweets = utils.injectTweets(currTweets, tweetsToInject)
    const feedLenAfterInjection = currTweets.length
    if(feedLenAfterInjection - feedLenBeforeInjection == 0){
        // No tweets injected, probably all are not up to date.
        let notUpdatedEnts = utils.getNotUpdatedEntities(entitiesStates)
        if(notUpdatedEnts.length > 0){
            // Select randomly the entities to update
            utils.shuffleArray(notUpdatedEnts)
            // Select some of the first entites
            const numEntsToUpdate = Math.min(3, params.numUpdatesForIteration)
            notUpdatedEnts = notUpdatedEnts.slice(0, numEntsToUpdate)
            // Call with await to update the injected tweets
            console.log("updating injections tweets before injecting")
            await utils.updateInjectionTweets(participant, injectionDoc, notUpdatedEnts)
            // Call the function again for injecting the updated tweets injections
            return injectTweets(participant, currTweets)
        }
    }

    let notUpdatedEnts = utils.getNotUpdatedEntities(entitiesStates)
    if(notUpdatedEnts.length > 0){
        // Select randomly the entities to update
        utils.shuffleArray(notUpdatedEnts)
        // Select the first "numUpdatesForIteration" entites
        notUpdatedEnts = notUpdatedEnts.slice(0, params.numUpdatesForIteration)
        // Update the is_updating_now field for those entities
        await utils.changeIsUpdatingStatus(expId, groupId, entitiesStates, notUpdatedEnts, true)
        // Call w/o await to update the injected tweets
        console.log("updating injections tweets")
        utils.updateInjectionTweets(participant, injectionDoc, notUpdatedEnts)
        .then(function(res){
            console.log("Done updating injection tweets in async way")
        })
    }
    return currTweets

}

function removeMediaFromTweets(removeMediaManipulation, tweets, participantUsername){
    const usersToRemoveMedia = removeMediaManipulation.users
    const keywordsToRemoveMedia = prepareKeywords(removeMediaManipulation.keywords)
    const keywordsRegexes = getRegexesFromKeywords(keywordsToRemoveMedia)
    for (let i = 0; i < tweets.length; i++) {
        let tweet = tweets[i];
        const partsMatchingManip = isTweetMatchToManipulation(tweet, usersToRemoveMedia, keywordsToRemoveMedia,
            keywordsRegexes, participantUsername)
        if(partsMatchingManip){
            /*  The tweet is matching the given keywords and users in the manipulation,
                now decide what to do with it. In this case,  we want to add 
                a field that indicates the media should be removed */
            if(partsMatchingManip.outer_tweet){
                tweet.remove_media = true
            }
            if(partsMatchingManip.retweet_status){
                tweet.retweeted_status.remove_media = true
            }
            if(partsMatchingManip.quote_status){
                tweet.quoted_status.remove_media = true
            }
            if(partsMatchingManip.quote_status_inside_retweet){
                tweet.retweeted_status.quoted_status.remove_media = true
            }
        }
    }
    return tweets
}

function pixelMediaInTweets(pixelMediaManipulation, tweets, participantUsername){
    const usersToPixelMedia = pixelMediaManipulation.users
    const keywordsToPixelMedia = prepareKeywords(pixelMediaManipulation.keywords)
    const keywordsRegexes = getRegexesFromKeywords(keywordsToPixelMedia)
    for (let i = 0; i < tweets.length; i++) {
        let tweet = tweets[i];
        const partsMatchingManip = isTweetMatchToManipulation(tweet, usersToPixelMedia, keywordsToPixelMedia,
            keywordsRegexes, participantUsername)
        if(partsMatchingManip){
            /*  The tweet is matching the given keywords and users in the manipulation,
                now decide what to do with it. In this case, we want to add 
                a field that indicates the media should be pixelated */
            if(partsMatchingManip.outer_tweet){
                tweet.pixel_media = true
            }
            if(partsMatchingManip.retweet_status){
                tweet.retweeted_status.pixel_media = true
            }
            if(partsMatchingManip.quote_status){
                tweet.quoted_status.pixel_media = true
            }
            if(partsMatchingManip.quote_status_inside_retweet){
                tweet.retweeted_status.quoted_status.pixel_media = true
            }
        }
    }
    return tweets
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
    If the tweet match to the manipulation, returns an object of the parts of the tweet
    that are matching to the manip - 
    {
        "outer_tweet": true,
        "retweet_status": true,
        "quote_status": true,
        "quote_status_inside_retweet": true,
    } 
    Else returns false
*/
function isTweetMatchToManipulation(tweet, usersManip, keywords, keywordsRegexes, pUsername){
    let partsMatchingManip = {}
    const entities = tweet.entities
    /*  If the participant is the author of the tweet
        or is mentioned in the tweet, we do not want to manipulate the tweet. */
    if(isUserMentioned(entities.user_mentions, pUsername)){
        return false
    }
    const user = tweet.user
    if(pUsername == user.screen_name){
        // The participant is the author of the tweet
        return false
    }


    if(usersManip.includes(user.screen_name)){
        // One of the users in the manipulation wrote this tweet
        // return true
        partsMatchingManip.outer_tweet = true
    }

    if(isKeywordsInHashtags(entities.hashtags, keywords)){
        // One of the hashtags in the tweet is in the keywords
        // return true
        partsMatchingManip.outer_tweet = true
    }

    const tweetText = tweet.full_text
    if(isRegexesInText(tweetText, keywordsRegexes)){
        // The tweet's text contains one of the keywords
        // return true
        partsMatchingManip.outer_tweet = true
    }

    // Check if it is a retweet
    if(tweet.retweeted_status && tweet.retweeted_status){
        const original = tweet.retweeted_status

        const originalUser = original.user
        if(pUsername == originalUser.screen_name){
            // The participant was retweeted by someone, so do not manipulate this tweet
            return false
        }
        if(usersManip.includes(originalUser.screen_name)){ 
            // This is a retweet and one of the users in the manipulation wrote the ORIGINAL tweet
            // return true
            partsMatchingManip.retweet_status = true
        }

        const originalEntities = original.entities
        if(isKeywordsInHashtags(originalEntities.hashtags, keywords)){
            // One of the hashtags in the original tweet is in the keywords
            // return true
            partsMatchingManip.retweet_status = true
        }
        
        const originalText = original.full_text
        if(isRegexesInText(originalText, keywordsRegexes)){
            // The original tweet's text contains one of the keywords
            // return true
            partsMatchingManip.retweet_status = true
        }
        // Check if there is a quote inside the retweet
        if(original.is_quote_status === true && original.quoted_status){
            const inside_quoted = original.quoted_status
            const quotedUser = inside_quoted.user
            if(pUsername == quotedUser.screen_name){
                // The participant is the quoted author, so do not manipulate this tweet
                return false
            }
            if(usersManip.includes(quotedUser.screen_name)){ 
                // This is a quote and one of the users in the manipulation wrote the quoted tweet
                // return true
                partsMatchingManip.quote_status_inside_retweet = true
            }

            const quotedEntities = inside_quoted.entities
            if(isKeywordsInHashtags(quotedEntities.hashtags, keywords)){
                // One of the hashtags in the quoted tweet is in the keywords
                // return true
                partsMatchingManip.quote_status_inside_retweet = true
            }
            
            const quotedText = inside_quoted.full_text
            if(isRegexesInText(quotedText, keywordsRegexes)){
                // The quoted tweet's text contains one of the keywords
                // return true
                partsMatchingManip.quote_status_inside_retweet = true
            }
        }

    }

    // Check if it is a quote
    if(tweet.is_quote_status === true && tweet.quoted_status){
        const quoted = tweet.quoted_status

        const quotedUser = quoted.user
        if(pUsername == quotedUser.screen_name){
            // The participant is the quoted author, so do not manipulate this tweet
            return false
        }

        if(usersManip.includes(quotedUser.screen_name)){ 
            // This is a quote and one of the users in the manipulation wrote the quoted tweet
            // return true
            partsMatchingManip.quote_status = true
        }

        const quotedEntities = quoted.entities
        if(isKeywordsInHashtags(quotedEntities.hashtags, keywords)){
            // One of the hashtags in the quoted tweet is in the keywords
            // return true
            partsMatchingManip.quote_status = true
        }
        
        const quotedText = quoted.full_text
        if(isRegexesInText(quotedText, keywordsRegexes)){
            // The quoted tweet's text contains one of the keywords
            // return true
            partsMatchingManip.quote_status = true
        }
    }

    if(partsMatchingManip.outer_tweet || partsMatchingManip.retweet_status || 
        partsMatchingManip.quote_status || partsMatchingManip.quote_status_inside_retweet){
        return partsMatchingManip
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
