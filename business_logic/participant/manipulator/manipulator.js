/*
    __  ______    _   __________  __  ____    ___  __________  ____ 
   /  |/  /   |  / | / /  _/ __ \/ / / / /   /   |/_  __/ __ \/ __ \  TM
  / /|_/ / /| | /  |/ // // /_/ / / / / /   / /| | / / / / / / /_/ /
 / /  / / ___ |/ /|  // // ____/ /_/ / /___/ ___ |/ / / /_/ / _, _/ 
/_/  /_/_/  |_/_/ |_/___/_/    \____/_____/_/  |_/_/  \____/_/ |_|  

                            By Twixper
 */


function manipulateTweets(manipulations, tweets){
    let manipulatedTweets = tweets
    const muteManipulation = manipulations.find(man => man.type == "mute") 
    if (muteManipulation!= null){
        manipulatedTweets = muteTweets(muteManipulation, manipulatedTweets)
    }
    return manipulatedTweets
}

function muteTweets(muteManipulation, tweets){
    const usersToMute = muteManipulation.users
    // TODO: Later add "const keywords = ..."
    let filteredTweets = []
    for (let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i];
        let isSafeTweet = true
        const user = tweet.user
        if(!usersToMute.includes(user.screen_name)){ // Tweet is safe so far
            // Check if it is a retweet
            if(tweet.retweeted_status && tweet.retweeted_status){ 
                const original = tweet.retweeted_status
                const original_user = original.user
                if(usersToMute.includes(original_user.screen_name)){ // Tweet not safe
                    isSafeTweet = false
                }
            }
            // Check if it is a quote (if the tweet is safe so far)
            if(isSafeTweet && tweet.is_quote_status === true && tweet.quoted_status){
                const quoted_tweet = tweet.quoted_status
                const quoted_user = quoted_tweet.user
                if(usersToMute.includes(quoted_user.screen_name)){ // Tweet not safe
                    isSafeTweet = false
                }
            }
        }
        else{
            isSafeTweet = false
        }

        if(isSafeTweet){
            filteredTweets.push(tweet)
        }
    }
    return filteredTweets
}

exports.manipulateTweets = manipulateTweets
