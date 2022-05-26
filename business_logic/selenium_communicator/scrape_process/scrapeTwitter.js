const {By, Key, until} = require('selenium-webdriver');
const JS_SCROLL_BOTTOM = 'window.scrollTo(0, document.body.scrollHeight)';

async function scrapeWhoToFollow(tab){
    try{
        var whoToFollowElement_x_path = "/html/body/div[1]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div[4]/aside/div[2]";
        var all_who_to_follow = await tab.findElement(By.xpath(whoToFollowElement_x_path));
        var all_buttons = await all_who_to_follow.findElements(By.css("[role='button']"));
        var all_images = await all_who_to_follow.findElements(By.css("img"));
        var profile_names_arr = new Array();
        for(var i = 0 ; i < all_buttons.length; i++){
            var text = await all_buttons[i].getText();
            var arr = text.split('\n'); 
            for(var j = 0 ; j < arr.length; j++){
                if(arr[j] != "Follow" & arr[j] != "Promoted"){
                    profile_names_arr.push(arr[j]);
                }
            }
        }
        // Adding names collected as username & and username with @ to the object to send
        var profile_names_arr_final = new Array();
        for(var j = 0 ; j < profile_names_arr.length; j = j + 2){
            if(j>0){
                var img_index = j/2; 
            }
            else{
                img_index = j;
            }
            profile_names_arr_final.push({"user_name":profile_names_arr[j],"user_name_url":profile_names_arr[j+1],"img":await all_images[img_index].getAttribute("src")});
        }
        return profile_names_arr_final;
    }
    catch(error){
        console.log(error);
    }
}

async function getFeed(tab){
    try{
        var all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
        return await HelpParseTweets(all_tweets_on_page);
    }
    catch(error){
        console.log(error);
    }
}

async function scrollPost(tab){
    await tabWait(tab,500);
    await tab.executeScript('window.scrollTo(0, 600)');
    await tabWait(tab,5000);
}

async function getProfileContent(tab,tweet_username){
    try{
        // await tabWait(tab,2000);
        await reloadPage(tab);
        await tab.get("https://twitter.com/"+tweet_username);
        let primary_column = await tab.findElement(By.css("[data-testid='primaryColumn']"));
        let json_details = await getPersonalDetailsFromProfileContent(primary_column);
        // await getTweetsTabFromProfileContent(tab);
        // await getLikesTabFromProfileContent(tab);

        return json_details;
    }
    catch(error){
        console.log(error);
    }
}

async function getPersonalDetailsFromProfileContent(primary_column){
    let json_of_details = {};
    let cover_and_profile_img = await primary_column.findElements(By.css("img"));
    try{
        await retrieveCoverAndProfileImagesFromElement(json_of_details,cover_and_profile_img);
        json_of_details.username = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserName']")));
        let username = json_of_details.username.split("@")[1];
        json_of_details.following_count = await retrieveTextFromElement(await primary_column.findElements(By.css(`[href='/${username}/following']`)));
        json_of_details.followers_count = await retrieveTextFromElement(await primary_column.findElements(By.css(`[href='/${username}/followers']`)));
        json_of_details.user_description = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserDescription']")));
        json_of_details.user_location = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserLocation']")));
        await retrieveWhenJoinedFromElement(json_of_details,primary_column);
        json_of_details.user_url = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserUrl']")));
        json_of_details.user_profession = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserProfessionalCategory']")));
    }
    catch(error){
        // One of the elements has not been field by the user
        console.log(error);
    }
    finally{
        return json_of_details;
    }
}

async function retrieveWhenJoinedFromElement(json_of_details,primary_column){
    if(json_of_details.user_location == null){
        json_of_details.when_joined = await (await primary_column.findElements(By.css("[role='presentation']")))[0].getText();
    }
    else{
        json_of_details.when_joined = await (await primary_column.findElements(By.css("[role='presentation']")))[1].getText();
    }
}

async function retrieveCoverAndProfileImagesFromElement(json_of_details,cover_and_profile_img){
    if(cover_and_profile_img.length == 1){
        json_of_details.profile_img = await cover_and_profile_img[0].getAttribute("src");
        json_of_details.cover_photo = null;
    }
    else{
        json_of_details.cover_photo = await cover_and_profile_img[0].getAttribute("src");
        json_of_details.profile_img = await cover_and_profile_img[1].getAttribute("src");
    }
}

async function retrieveTextFromElement(e){
    if (e.length == 0){
        return null;
    }
    else{
        let text_to_return = null;
        if (e instanceof Array){
            text_to_return = await e[0].getText();
        }
        else{
            text_to_return = await e.getText();
        }
        return text_to_return;
    }
}

async function getTweetsTabFromProfileContent(tab,n){
    await scrollPost(tab);
    return await getFeed(tab,n);
}

async function getLikesTabFromProfileContent(tab){
    try{
        let tab_url = await tab.getCurrentUrl();
        await tab.get(tab_url+"/likes");
        await tabWait(tab,2000);
        let primary_column = await tab.findElement(By.css("[data-testid='primaryColumn']"));
        let all_likes_on_page = await primary_column.findElements(By.css("[role='article']"));
        let likes_arr = await helpParseLikes(tab,all_likes_on_page);
    }
    catch(error){
        console.log(error);
    }
}

async function helpParseLikes(tab,all_likes_on_page){
    var likes_arr = new Array();
    for(let i=0; i<all_likes_on_page.length; i++){
        let like_links_arr = await all_likes_on_page[i].findElements(By.css("[role='link']"));
        let user_name = await like_links_arr[1].getText();
        let user_name_url = await like_links_arr[2].getText();
        let created_at = await like_links_arr[3].getText();
        
        let likes_comments_retweets_element = await all_likes_on_page[i].findElement(By.css("[role='group']"));
        let parent_of_parent = await likes_comments_retweets_element.findElement(By.xpath("../..")).getText();
        for(let j=0; j<parent_of_parent.length; j++){
            let x = await parent_of_parent[j].getText();
            let y=3;
        }
        
    }
}

async function getProfileLink_ImageUrl(tweet){
    let link_href = null;
    let profile_img_url = null;
    try{
        let profile_link = await tweet.findElement(By.css("[role='link']"));
        link_href = await profile_link.getAttribute("href");
        let profile_img = await profile_link.findElement(By.css("img"));
        profile_img_url = await profile_img.getAttribute("src");
    }
    catch(error){
        console.log('No profile link / image url');
    }
    finally{
        return {link_href,profile_img_url};
    }
}

async function getTweetId(tweet){
    let tweetIds = new Array();
    try{
    // let links_components = await tweet.findElements(By.css("[role='link']"));
    let links_components = await tweet.findElements(By.css("a"));
    for(let i=0; i<links_components.length; i++){
        let link_comp_url = await links_components[i].getAttribute("href");
        if(link_comp_url.includes("status")){
            let split_url_arr = link_comp_url.split("/");
            tweetIds.push(split_url_arr[split_url_arr.length-1]);
        }
    }
    }
    catch(error){
        console.log('error in links');
    }
    finally{
        return tweetIds;
    }
}

async function getTweetRepliesRetweetsLikes(tweet){
    let replies_num = 0;
    let retweets_num = 0;
    let likes_num = 0;
    try{
        let group_of_buttons = await tweet.findElement(By.css("[role='group']"));
        let text_with_dets = await group_of_buttons.getAttribute("aria-label");
        let split_text_to_different_actions = text_with_dets.split(',');
        if(split_text_to_different_actions[0]?.includes('replies')){
            replies_num = split_text_to_different_actions[0].split(' ')[0];
        }
        if(split_text_to_different_actions[1]?.includes('Retweets')){
            retweets_num = split_text_to_different_actions[1].split(' ')[1];
        }
        if(split_text_to_different_actions[2]?.includes('likes')){
            likes_num = split_text_to_different_actions[2].split(' ')[1];
        }
    }
    catch(error){
        console.log('no replies & retweets & likes.');
    }
    finally{
        return {replies_num,retweets_num,likes_num};
    }
}

async function isProfileVerified(tweet){
    let is_profile_verified = 0;
    try{
        let verified_labels = await tweet.findElements(By.css("[aria-label='Verified account']"));
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

async function getTweetId_Profilelink_Imgurl_repliesRetweetsLikes_ProfileVerification_Fulltext(tweet){
    let tweet_ids = await getTweetId(tweet);
    let profile_link_img_url = await getProfileLink_ImageUrl(tweet);
    let replies_retweets_likes = await getTweetRepliesRetweetsLikes(tweet);
    let is_profile_verified = await isProfileVerified(tweet);
    let full_text = await getTweetContent(tweet);
    return {tweet_ids, profile_link_img_url, replies_retweets_likes, is_profile_verified, full_text};
}

async function checkIfThereIsSocialContext(tweet){
    let is_there_social_context = false;
    try{
        let social_context = await tweet.findElement(By.css("[data-testid='socialContext']"));
        is_there_social_context = true;
    }
    catch(error){
        console.log('Profile do not have social context.');
    }
    finally{
        return is_there_social_context;
    }
}


async function tabWait(tab,ms){
    try{
        await tab.wait(() => {let x=null;}, ms);
    }
    catch{
        return true;
    }    
}

async function HelpParseTweets(all_tweets_on_page){
    var tweets_arr = new Array();
    // Iterate over each on n tweets
    for(let i = 0 ; i < all_tweets_on_page.length; i++){
        let tweet = all_tweets_on_page[i];

        if(await checkIfThereIsSocialContext(tweet)){
            continue;
        }
        let some_tweet_dets = await getTweetId_Profilelink_Imgurl_repliesRetweetsLikes_ProfileVerification_Fulltext(tweet); 

        let arr = (await tweet.getText()).split('\n');
        let len_arr = arr.length;
        let index_end_post_content = len_arr -1;
        let after_post_index = 0;
        let inside_after_post_index = 0;

        // variables for json
        let is_retweet = null;
        let is_promoted = 0;
        let created_at = null;
        let user_name = null;
        let user_url_name = null;
        let shared_tweet = null;

        // Conditions for parsing different tweets
        if(arr[len_arr-1] === "Promoted"){
            // Check if tweet is promoted tweet
            user_name = arr[0];
            user_url_name = arr[1];
            after_post_index = 2;
            is_promoted = 1;
        }
        else if(arr[0].includes("Retweeted")){
            // Check if tweet is Retweet
            user_name = arr[1];
            user_url_name = arr[2];
            created_at = arr[4];
            after_post_index = 5;
            is_retweet = arr[0];
        }
        else if(arr.includes("Quote Tweet")){
            // Check if tweet is tweet sharing (quoting)
            user_name = arr[0];
            user_url_name = arr[1];
            created_at = arr[3];
            after_post_index = 4;
            index_end_post_content = arr.indexOf("Quote Tweet");
            is_retweet = 0;

            // Now, figure out shared tweet's details
            // Getting ready inside tweet to load inside the json
            var inside_user_name = arr[index_end_post_content+1];
            var inside_user_url_name = arr[index_end_post_content+2];
            var inside_when_posted = arr[index_end_post_content+3].split(' ')[2];
            inside_after_post_index = index_end_post_content+4;
            var inside_post_content_arr = new Array();

            await getQuotedTweetContent(inside_after_post_index, len_arr, arr, inside_post_content_arr);
            // await getQuotedTweetProfilelink_Imageurl(tweet);
            // let some_qouted_tweet_dets = await getQuotedTweetId_Profilelink_Imgurl(tweet); 
            let quoted_profile_verified = false;
            let quoted_tweet_id = null;
            if(some_tweet_dets.is_profile_verified == 2){
                quoted_profile_verified = true;
            }
            if(some_tweet_dets.tweet_ids.length == 2){
                quoted_tweet_id = some_tweet_dets.tweet_ids[1];
            }
            
            shared_tweet = {
                user_name:inside_user_name,
                user_url_name:inside_user_url_name,
                // profile_img_url: ,
                created_at:inside_when_posted,
                full_text:inside_post_content_arr,
                is_profile_verified: quoted_profile_verified,
                is_promoted:null,
                // profile_link: null,
                // tweet_id: quoted_tweet_id
            }
        }
        else{

            // If it is a regular tweet
            user_name = arr[0];
            user_url_name = arr[1];
            created_at = arr[3];
            after_post_index = 4;
        }

        let profile_verified = false;
        if(some_tweet_dets.is_profile_verified > 0){
            profile_verified = true;
        }

        tweets_arr.push({
            user_name,
            user_url_name,
            profile_img_url: some_tweet_dets.profile_link_img_url.profile_img_url,
            created_at,
            full_text : some_tweet_dets.full_text,
            comments_count : some_tweet_dets.replies_retweets_likes.replies_num,
            retweets_count : some_tweet_dets.replies_retweets_likes.retweets_num,
            likes_count : some_tweet_dets.replies_retweets_likes.likes_num,
            is_retweet,
            is_promoted,
            is_profile_verified : profile_verified,
            shared_tweet,
            profile_link: some_tweet_dets.profile_link_img_url.link_href,
            tweet_id : some_tweet_dets.tweet_ids[0]
        });
    }
    return tweets_arr;
}

async function getQuotedTweetContent(after_post_index,index_end_post_content,arr,post_content_arr){
    // Push first line of content
    post_content_arr.push(arr[after_post_index]);
    // Iterate over arr to get amount of post rows
    for(var j = 1 ; j < index_end_post_content; j++){
        // Get arr range for post content
        if(!/^\d+$/.test(arr[j+after_post_index]) && arr[j+after_post_index] != "Quote Tweet"){
            post_content_arr.push(arr[j+after_post_index]);
        }
        else{
            after_post_index = j+after_post_index;
            break;
        } 
    }
    return after_post_index;
}
async function getTweetContent(tweet){

    let tweet_content = '';
    try{
        tweet_content = await tweet.findElement(By.css("[data-testid='tweetText']")).getText(); 
    }
    catch(error){
        console.log('No tweet content');
    }
    finally{
        return tweet_content;
    }
}

async function reloadPage(tab){
    tab.navigate().refresh();
}

module.exports = {scrapeWhoToFollow : scrapeWhoToFollow, 
                getFeed : getFeed,
                getProfileContent : getProfileContent,
                scrollPost : scrollPost,
                tabWait : tabWait,
                HelpParseTweets:HelpParseTweets};