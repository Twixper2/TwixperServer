const {By, Key, until} = require('selenium-webdriver');
const JS_SCROLL_BOTTOM = 'window.scrollTo(0, document.body.scrollHeight)';

async function scrapeWhoToFollow(tab){
    var whoToFollowElement_x_path = "/html/body/div[1]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div[4]/aside/div[2]";
    var all_who_to_follow = await tab.findElement(By.xpath(whoToFollowElement_x_path));
    var all_buttons = await all_who_to_follow.findElements(By.css("[role='button']"));
    var all_images = await all_who_to_follow.findElements(By.css("img"));
    var img_1 = await all_images[0].getAttribute("src");
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

async function get_n_first_tweets(tab,n){
    var all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
    // Validate input n - number of tweets to retrieve
    var cur_num_of_tweets_on_page = all_tweets_on_page.length;
    if(!(/^\d+$/.test(n) && n > 0)){
        return 'Input n failed!';
    }
    return await HelpParseTweets(all_tweets_on_page, cur_num_of_tweets_on_page,tab);
}

async function scrollPost(tab){
    await tabWait(tab,2000);
    await tab.executeScript(JS_SCROLL_BOTTOM);
    await tabWait(tab,8000);
}

async function getProfileContent(tab,tweet_link){
    await tabWait(tab,200);
    await tab.get(tweet_link);
    let primary_column = await tab.findElement(By.css("[data-testid='primaryColumn']"));
    await getPersonalDetailsFromProfileContent(primary_column);
    // await getTweetsTabFromProfileContent(primary_column);
    // await getLikesTabFromProfileContent(primary_column);
    // tabs of tweets & likes
}

async function getPersonalDetailsFromProfileContent(primary_column){
    let json_of_details = {};
    let cover_and_profile_img = await primary_column.findElements(By.css("img"));
    try{
        json_of_details.cover_photo = await cover_and_profile_img[0].getAttribute("src");
        json_of_details.profile_img = await cover_and_profile_img[1].getAttribute("src");
        json_of_details.username = await primary_column.findElement(By.css("[data-testid='UserName']")).getText();
        let username = json_of_details.username.split("@")[1];
        json_of_details.following_count = await primary_column.findElement(By.css(`[href='/${username}/following']`)).getText();
        json_of_details.followers_count = await primary_column.findElement(By.css(`[href='/${username}/followers']`)).getText();
        json_of_details.user_description = await primary_column.findElement(By.css("[data-testid='UserDescription']")).getText();
        json_of_details.user_location = await primary_column.findElement(By.css("[data-testid='UserLocation']")).getText();
        json_of_details.when_joined = await primary_column.findElement(By.css("[role='presentation']")).getText();
        json_of_details.user_url = await primary_column.findElement(By.css("[data-testid='UserUrl']")).getText();
        json_of_details.user_profession = await primary_column.findElement(By.css("[data-testid='UserProfessionalCategory']")).getText();
    }
    catch(error){
        // One of the elements has not been field by the user
        console.log(error);
        return json_of_details;
    }
    // description of profile
    // details (followers, following, location, link, when joined)
}

async function getTweetsTabFromProfileContent(primary_column){

}
async function getLikesTabFromProfileContent(primary_column){
    
}


async function getProfileLink(tweet){
    var tweet_link = await tweet.findElement(By.css("[role='link']"));
    return await tweet_link.getAttribute("href");
}

async function tabWait(tab,ms){
    try{
        await tab.wait(() => {let x=0;}, ms);
    }
    catch{
        return true;
    }    
}

async function reloadPage(tab){
    tab.navigate().refresh();
}

async function HelpParseTweets(all_tweets_on_page, n, tab){
    var tweets_arr = new Array();
    // Iterate over each on n tweets
    for(var i = 0 ; i < n; i++){
        var tweet = all_tweets_on_page[i];

        // find link to page
        var tweet_link = await getProfileLink(tweet);

        var text = await tweet.getText();
        // To identify a poll on tweet
        // var x = await tweet.findElements(By.xpath("//div[data-testid='card.wrapper']"));
        var arr = text.split('\n');
        var len_arr = arr.length;
        var index_end_post_content = len_arr -1;
        var after_post_index = 0;
        var inside_after_post_index = 0;
        var full_text = new Array(); 

        // variables for json
        var is_retweet = undefined;
        var is_promoted = 0;
        var created_at = undefined;
        var user_name = undefined;
        var user_url_name = undefined;
        var comments_count = undefined;
        var retweets_count = undefined;
        var likes_count = undefined;
        var shared_tweet = undefined;

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

            await getTweetContent(inside_after_post_index, len_arr, arr, inside_post_content_arr);
            
            // Modify pointer for comments, likes, retweets

            shared_tweet = {
                user_name:inside_user_name,
                user_url_name:inside_user_url_name,
                created_at:inside_when_posted,
                full_text:inside_post_content_arr,
                comments_count:undefined,
                retweets_count:undefined,
                likes_count:undefined,
                is_retweet:undefined,
                is_promoted:undefined,
                shared_tweet:undefined,
            }
            
        }
        else{
            // If it is a regular tweet
            user_name = arr[0];
            user_url_name = arr[1];
            created_at = arr[3];
            after_post_index = 4;
        }

        after_post_index = await getTweetContent(after_post_index,index_end_post_content,arr,full_text);
        if(arr.includes("Quote Tweet")){
            after_post_index = inside_after_post_index +1;
        }
        if(len_arr == after_post_index + 3){
            // This means none of comments/retweets/likes is 0
            comments_count = arr[after_post_index];
            retweets_count = arr[after_post_index + 1];
            likes_count = arr[after_post_index + 2];
        }
        tweets_arr.push({
            user_name,
            user_url_name,
            created_at,
            full_text,
            comments_count,
            retweets_count,
            likes_count,
            is_retweet,
            is_promoted,
            shared_tweet,
            tweet_link
        });
    }
    return tweets_arr;
}

async function getTweetContent(after_post_index,index_end_post_content,arr,post_content_arr){
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

async function getLinkToProfileFromTweet(tab){

}

module.exports = {scrapeWhoToFollow : scrapeWhoToFollow, 
                get_n_first_tweets : get_n_first_tweets,
                scrollPost : scrollPost,
                getProfileContent : getProfileContent};