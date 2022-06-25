const {By, Key, until} = require('selenium-webdriver');
var {twitter_address, status_text, entity_constants, selenium_constants} = require("../../twitter_communicator/static_twitter_data/ConstantsJSON.js");
const attribute_names = selenium_constants.attribute_names;
const attribute_values = selenium_constants.attribute_values;


async function scrapeWhoToFollow(tab){
    try{
        let all_who_to_follow = await tab.findElement(By.css("["+attribute_names.aria_label+"="+"'"+attribute_values.whoToFollow+"'"+"]"));
        let all_buttons = await all_who_to_follow.findElements(By.css("["+attribute_names.data_test_id+"="+attribute_values.UserCell+"]"));
        let all_images = await all_who_to_follow.findElements(By.css(attribute_names.img));
        // let x = await all_buttons?.findElement(By.css("[aria-label='Verified account']"));
        let profile_names_arr = new Array();
        for(let i = 0 ; i < all_buttons.length; i++){
            var text = await all_buttons[i].getText();
            var arr = text.split('\n'); 
            for(var j = 0 ; j < arr.length; j++){
                if(arr[j] != "Follow" & arr[j] != "Promoted"){
                    profile_names_arr.push(arr[j]);
                }
            }
        }
        // Adding names collected as username & and username with @ to the object to send
        let profile_names_arr_final = new Array();
        for(let j = 0 ; j < profile_names_arr.length; j = j + 2){
            if(j>0){
                var img_index = j/2; 
            }
            else{
                img_index = j;
            }

            profile_names_arr_final.push({"user_name":profile_names_arr[j],
                                        "user_name_url":profile_names_arr[j+1].split('@')[1],
                                        "img":await all_images[img_index].getAttribute(attribute_names.src),  
                                        "is_profile_verified": await isProfileVerified_WhoToFollow(all_buttons[j])});
        }
        return profile_names_arr_final;
    }
    catch(error){
        console.log('error with whoToFollow.');
    }
}

async function getFeed(tab){
    try{
        var all_tweets_on_page = await tab.findElements(By.css("["+attribute_names.role+"="+attribute_values.article+"]"));
        return await HelpParseTweets(all_tweets_on_page);
    }
    catch(error){
        console.log('error with getFeed.');
    }
}

async function getUserEntityDetails(tab){
    try{
        let primary_column = await tab.findElement(By.css("["+attribute_names.data_test_id+"="+attribute_values.primaryColumn+"]"));
        let entity_details = await getPersonalDetailsFromProfileContent(primary_column);
        return {entity_details};
    }
    catch(error){
        console.log('error with getUserEntityDetails.');
    }
    finally{

    }
}

async function getUserTimeline(tab){
    try{
        return await getFeed(tab);
    }
    catch(error){
        console.log('error with getUserTimeline');
    }
}

async function getUserLikes(tab){
    try{
        let primary_column = await tab.findElement(By.css("["+attribute_names.data_test_id+"="+attribute_values.primaryColumn+"]"));
        return await getFeed(primary_column);
    }
    catch(error){
        console.log('error with getUserLikes');
    }
}

async function getTweet(tab, tweet_id_str){
    try{
        let primary_column = await tab.findElement(By.css("["+attribute_names.data_test_id+"="+attribute_values.primaryColumn+"]"));
        let tweet_and_replies = await getFeed(primary_column);
        let tweets_len = tweet_and_replies.length;
        let index = tweet_and_replies.map(t => t.tweet_id.toString()).indexOf(tweet_id_str);
        return (tweets_len > 1) ? tweet_and_replies.slice(index+1,tweet_and_replies.length) : [];
    }
    catch(error){
        console.log('error with getTweet.');
    }
}

async function getPersonalDetailsFromProfileContent(primary_column){
    let json_of_details = {};
    let cover_and_profile_img = await primary_column.findElements(By.css(attribute_names.img));
    try{
        await retrieveCoverAndProfileImagesFromElement(json_of_details,cover_and_profile_img);
        let username = (await retrieveTextFromElement(await primary_column.findElements(By.css("["+attribute_names.data_test_id+"="+attribute_values.UserName+"]")))).split("@")[1];
        json_of_details.username = username;
        json_of_details.following_count = await retrieveTextFromElement(await primary_column.findElements(By.css(`[href='/${username}/following']`)));
        json_of_details.followers_count = await retrieveTextFromElement(await primary_column.findElements(By.css(`[href='/${username}/followers']`)));
        json_of_details.user_description = await retrieveTextFromElement(await primary_column.findElements(By.css("["+attribute_names.data_test_id+"="+attribute_values.UserDescription+"]")));
        json_of_details.user_location = await retrieveTextFromElement(await primary_column.findElements(By.css("["+attribute_names.data_test_id+"="+attribute_values.UserLocation+"]")));
        await retrieveWhenJoinedFromElement(json_of_details,primary_column);
        json_of_details.user_url = await retrieveTextFromElement(await primary_column.findElements(By.css("["+attribute_names.data_test_id+"="+attribute_values.UserUrl+"]")));
        json_of_details.user_profession = await retrieveTextFromElement(await primary_column.findElements(By.css("["+attribute_names.data_test_id+"="+attribute_values.UserProfessionalCategory+"]")));
        json_of_details.is_profile_verified = (await isProfileVerified(await primary_column.findElement(By.css("["+attribute_names.role+"="+attribute_values.heading+"]"))) > 0) ? true : false; 
        let followingStatus = await retrieveTextFromElement(await primary_column.findElements(By.css("["+attribute_names.data_test_id+"="+attribute_values.placementTracking+"]")));
        if(followingStatus != null){
            json_of_details.FollowingStatus = (followingStatus === "Following") ? true : false;
        }
    }
    catch(error){
        // One of the elements has not been field by the user
        console.log('error with getPersonalDetailsFromProfileContent');
    }
    finally{
        return json_of_details;
    }
}

async function retrieveWhenJoinedFromElement(json_of_details,primary_column){
    try{
        let when_joined = await (await primary_column.findElements(By.css("["+attribute_names.role+"="+attribute_values.presentation+"]")));
        if(json_of_details.user_location == null){
            json_of_details.when_joined = when_joined[0].getText();
        }
        else{
            json_of_details.when_joined = when_joined[1].getText();
        }
    }
    catch(error){
        console.log('error with retrieveWhenJoinedFromElement');
    }
}

async function retrieveCoverAndProfileImagesFromElement(json_of_details,cover_and_profile_img){
    try{
        if(cover_and_profile_img.length == 1){
            json_of_details.profile_img = await cover_and_profile_img[0].getAttribute(attribute_names.src);
            json_of_details.cover_photo = null;
        }
        else{
            json_of_details.cover_photo = await cover_and_profile_img[0].getAttribute(attribute_names.src);
            json_of_details.profile_img = await cover_and_profile_img[1].getAttribute(attribute_names.src);
        }
    }
    catch(error){
        console.log('error with retrieveCoverAndProfileImagesFromElement');
    }
}

async function retrieveTextFromElement(e){
    let text_to_return = null;
    try{
        if (e instanceof Array){
            text_to_return = await e[0].getText();
        }
        else{
            text_to_return = await e.getText();
        }
    }
    catch(error){
        console.log('no text to retrieve from element');
    }
    finally{
        return text_to_return;
    }
}

async function getProfileLink_ImageUrl(tweet){
    let link_href = null;
    let profile_img_url = null;
    try{
        let profile_link = await tweet.findElement(By.css("["+attribute_names.role+"="+attribute_values.link+"]"));
        link_href = await profile_link.getAttribute(attribute_names.href);
        let profile_img = await profile_link.findElement(By.css(attribute_names.img));
        profile_img_url = await profile_img.getAttribute(attribute_names.src);
    }
    catch(error){
        console.log('No profile link / image url');
    }
    finally{
        return {link_href,profile_img_url};
    }
}

async function getTweetId(tweet){
    let tweetIds = new Set();
    try{
        let links_components = await tweet.findElements(By.css(attribute_names.a));
        for(let i=0; i<links_components.length; i++){
            let link_comp_url = await links_components[i].getAttribute(attribute_names.href);
            if(link_comp_url.includes(status_text)){
                let split_url_arr = link_comp_url.split("/");
                let status_index = split_url_arr.indexOf(status_text);
                tweetIds.add(split_url_arr[status_index+1]);
            }
        }
    }
    catch(error){
        console.log('error with getting tweet id');
    }
    finally{
        return tweetIds;
    }
}

async function getTweetRepliesRetweetsLikes_TweetActions(tweet){
    let tweet_actions = null;
    let replies_retweets_likes = null;
    try{
        let group_of_buttons = await tweet.findElement(By.css("["+attribute_names.role+"="+attribute_values.group+"]"));
        replies_retweets_likes = await getNumOfTweetActions(group_of_buttons);
        tweet_actions = await getTweetActions(group_of_buttons);    
    }
    catch(error){
        console.log('problem with twitter actions collecting.');
    }
    finally{
        return {replies_retweets_likes, tweet_actions};
    }
}

async function getNumOfTweetActions(group_of_buttons){
    let replies_num = 0;
    let retweets_num = 0;
    let likes_num = 0;
    try{
        let text_with_dets = await group_of_buttons.getAttribute(attribute_names.aria_label);
        let split_text_to_different_actions = text_with_dets.split(',');
        
        for(let i=0; i<split_text_to_different_actions.length; i++){
            let action_not_trimmed = split_text_to_different_actions[i];
            let action_len = split_text_to_different_actions[i].length;
            let action = (action_not_trimmed[0] === ' ') ? action_not_trimmed.slice(1,action_len) : action_not_trimmed;
            if(action === '1 reply' ||
            action?.includes('replies')){
                replies_num = await getSpecificActionNum(action);
            }
            else if(action === '1 Retweet' ||
            action?.includes('Retweets')){
                retweets_num = await getSpecificActionNum(action);
            }
            else if(action === '1 like' ||
            action?.includes('likes')){
                likes_num = await getSpecificActionNum(action);
            }
        }
    }
    catch(error){
    }
    finally{
        return {replies_num, retweets_num, likes_num};
    }   
}
    
async function getSpecificActionNum(action){
    let num = 0;
    try{
        num = action.split(' ')[0];
    }
    catch(error){
    }
    finally{
        return parseInt(num);
    }
    
}

async function getTweetActions(group_of_buttons){
    let favorited = false;
    let retweeted = false;
    try{
        let buttons_of_group = await group_of_buttons.findElements(By.css("["+attribute_names.role+"="+attribute_values.button+"]"));
        let retweet_button = await buttons_of_group[1];
        let like_button = await buttons_of_group[2];

        let retweet_button_text = await retweet_button.getAttribute(attribute_names.aria_label);
        let like_button_text = await like_button.getAttribute(attribute_names.aria_label);

        if(like_button_text.includes('Liked')){
            favorited = true;
        }
        if(retweet_button_text.includes('Retweeted')){
            retweeted = true;
        }
    }
    catch(error){
        console.log('error with getTweetActions');
    }
    finally{
        return {favorited, retweeted};
    }
    
}

async function getTweetPhotos(tweet){
    let tweet_photos_url = new Array();
    try{
        let tweet_photos = await tweet.findElements(By.css("["+attribute_names.data_test_id+"="+attribute_values.tweetPhoto+"]"));
        for(let i=0; i< tweet_photos.length; i++){
            tweet_photos_url.push({"type": "photo",
                                "media_url_https": await (tweet_photos[i].findElement(By.css(attribute_names.img))).getAttribute(attribute_names.src),"sizes":entity_constants.sizes});
        }
    }
    catch(error){
        console.log('No photos in tweet');
    }
    finally{
        return tweet_photos_url;
    }
}

async function isProfileVerified_WhoToFollow(tab){
    is_profile_verified = false;
    try{
        is_profile_verified = await tab.findElement(By.css("["+attribute_names.aria_label+"="+"'"+attribute_values.verifiedAccount+"'"+"]")) != undefined;
    }
    catch(error){
    }
    finally{
        return is_profile_verified;
    }
    
}

async function isProfileVerified(tweet){
    let is_profile_verified = 0;
    try{
        let verified_labels = await tweet.findElements(By.css("["+attribute_names.aria_label+"="+attribute_values.verifiedAccount+"]"));
        if(verified_labels.length == 0){
            is_profile_verified = 0;
        }   
        else if(verified_labels.length == 1){
            is_profile_verified = 1;
        }
        else{
            is_profile_verified = 2;
        }
    }
    catch(error){
        console.log('Profile is not verified.');
    }
    finally{
        return is_profile_verified;
    }
}

async function IsThereIsSocialContext(tweet){
    let is_there_social_context = false;
    try{
        is_there_social_context = await tweet.findElement(By.css("["+attribute_names.data_test_id+"="+attribute_values.socialContext+"]")) != null;
    }
    catch(error){
    }
    finally{
        return is_there_social_context;
    }
}

async function HelpParseTweets(all_tweets_on_page){
    var tweets_arr = new Array();
    try{
        for(let i = 0 ; i < all_tweets_on_page.length; i++){
            let tweet = all_tweets_on_page[i];
            if(await IsThereIsSocialContext(tweet)){
                continue;
            }
            let arr = (await tweet.getText()).split('\n');
            let len_arr = arr.length;
            if(arr[len_arr-1] === "Promoted"){
                continue;
            }
            let created_at = null;
            let user_name = null;
            let user_url_name = null;
            let quoted_status = null;
            let is_quote_status = false;
            let tweet_photos = await getTweetPhotos(tweet);
            let are_profiles_verified = await isProfileVerified(tweet);
            let full_texts = await getTweetsContent(tweet);
            let tweet_ids = await getTweetId(tweet);
            let profile_link_And_img_url = await getProfileLink_ImageUrl(tweet);
            let replies_retweets_likes_And_tweet_actions = await getTweetRepliesRetweetsLikes_TweetActions(tweet);
            let replies_retweets_likes = replies_retweets_likes_And_tweet_actions.replies_retweets_likes;
            let tweet_actions = replies_retweets_likes_And_tweet_actions.tweet_actions;
            let retweeted = tweet_actions.retweeted;
            let favorited = tweet_actions.favorited;           
            let is_profile_verified = (are_profiles_verified > 0) ? true : false;
            let entities = {"hashtags":[],
                            "symbols":[],
                            "user_mentions":[],
                            "urls":[],
                            "media":(tweet_photos != null) ? tweet_photos : []};

            if(arr[0].includes("Retweeted")){
                // Check if tweet is Retweet
                user_name = arr[1];
                user_url_name = arr[2].split('@')[1];
                created_at = arr[4];
                after_post_index = 5;
                is_quote_status = true;
            }
            else if(arr.includes("Quote Tweet")){
                is_quote_status = true;
                user_name = arr[0];
                user_url_name = arr[1].split('@')[1];
                created_at = arr[3];
                quoted_status = await getQuoteTweetData(arr, full_texts, are_profiles_verified, tweet_ids, tweet);
            }
            else{
                // If it is a regular tweet
                user_name = arr[0];
                user_url_name = arr[1].split('@')[1];
                created_at = arr[3];
            }    
            let user = {name: user_name,
                screen_name : user_url_name}; 
            tweets_arr.push({
                user,favorited,retweeted,created_at,is_profile_verified,
                entities,is_quote_status,quoted_status,comments_count : replies_retweets_likes.replies_num,
                retweets_count : replies_retweets_likes.retweets_num,likes_count : replies_retweets_likes.likes_num,
                profile_img_url: profile_link_And_img_url.profile_img_url,profile_link: profile_link_And_img_url.link_href,
                full_text : full_texts[0],tweet_id : tweet_ids.values().next().value
            });
        }
    }
    catch(error){
        console.log('error with parsing tweets');
    }
    finally{
        return tweets_arr;
    }   
}

async function getQuotedTweetImageurl(tweet){
    try{
        return await tweet.findElement(By.css("["+attribute_names.role+"="+attribute_values.presentation+"]")).findElement(By.css(attribute_names.img)).getAttribute(attribute_names.src);
    }
    catch(error){
        console.log('error with getQuotedTweetImageurl');
    }
}

async function getTweetsContent(tweet){
    let tweet_text_contents_arr = new Array();
    let tweet_contents = await tweet.findElements(By.css("["+attribute_names.data_test_id+"="+attribute_values.tweetText+"]"));
    try{
        for(let i=0; i<tweet_contents.length; i++){
            tweet_text_contents_arr.push(await tweet_contents[i].getText());
        }
    }
    catch(error){
        console.log('No tweet contents');
    }
    finally{
        return tweet_text_contents_arr;
    }
}

async function getQuoteTweetData(arr, full_texts, are_profiles_verified, tweet_ids, tweet){
    user = null;
    created_at = null;
    try{
        // Check if tweet is tweet sharing (quoting)
        let index_end_post_content = arr.indexOf("Quote Tweet");
        // Now, figure out shared tweet's details
        let inside_user_name = arr[index_end_post_content+1];
        let inside_user_url_name = arr[index_end_post_content+2].split('@')[1];
        created_at = arr[index_end_post_content+3].split(' ')[2];
        user = {name: inside_user_name,
            screen_name : inside_user_url_name,
        };       
    }
    catch(error){
        console.log('error with getting Quote Tweet data');
    }
    finally{
        return {
            user,
            created_at,
            full_text:(full_texts.length > 1) ? full_texts[1] : null,
            is_profile_verified: (are_profiles_verified == 2) ? true : false,
            entities : entity_constants.entities,
            profile_img_url: await getQuotedTweetImageurl(tweet),
            profile_link: twitter_address+user.screen_name,
            tweet_id: (tweet_ids.length == 2) ? tweet_ids[1] : null
        };
    }
}

// async function algorithmicRankingButton(tab){
// }

module.exports = {scrapeWhoToFollow, 
                getFeed,
                getUserEntityDetails,
                HelpParseTweets,
                getUserTimeline,
                getUserLikes,
                getTweet,
                isProfileVerified,
                };