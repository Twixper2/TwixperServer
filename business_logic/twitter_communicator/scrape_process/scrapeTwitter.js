const {Builder, By, Key, until} = require('selenium-webdriver');
const JS_SCROLL_TOP = 'window.scrollTo(0, 0);';
const JS_SCROLL_BOTTOM = 'window.scrollTo(0, document.body.scrollHeight);';

async function scrapeWhoToFollow(tab){
    var whoToFollowElement_x_path = "/html/body/div[1]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div[4]/aside/div[2]";
    var all_who_to_follow = await tab.findElement(By.xpath(whoToFollowElement_x_path));
    var all_buttons = await all_who_to_follow.findElements(By.css("[role='button']"));
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
        profile_names_arr_final.push({"user_name":profile_names_arr[j],"user_name_url":profile_names_arr[j+1]});
    }
    return profile_names_arr_final;
}

async function get_n_first_tweets(tab,n){
    while(await isDocReady(tab) != true){
        // wait to load document
        let x = 0;
    }
    var all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
    var tweets_1 = await tab.findElements(By.css("article"));
    // Validate input n - number of tweets to retrieve
    console.log(all_tweets_on_page.length);
    console.log(tweets_1.length);
    var cur_num_of_tweets_on_page = all_tweets_on_page.length;
    if(!(/^\d+$/.test(n) && n > 0)){
        return 'Input n failed!';
    }
    var tweets_arr = new Array();
    await HelpParseTweets(tweets_arr, all_tweets_on_page, cur_num_of_tweets_on_page,tab);
    return tweets_arr; 
}

async function isDocReady(tab){
    return await tab.executeScript("return document.readyState") === 'complete';
}

async function scrollPost(tab){
    while(await isDocReady(tab) != true){
        // wait to load document
        let x = 0;
    }
    // When the first tweet is visible - execute scrollpage by one post
    let el = await tab.findElement(By.css("article"));
    await tab.wait(until.elementIsVisible(el),1);
    // Scroll till the end of page
    // await tab.executeScript("window.scrollBy(0,200)");
    await tab.executeScript(JS_SCROLL_BOTTOM);
    await tab.executeScript(JS_SCROLL_TOP);

}

async function scrollPage(tab){
    // When the first tweet is visible - execute scrollpage
    let el = await tab.findElement(By.css("[role='article']"));
    await tab.wait(until.elementIsVisible(el),1);
    // Scroll till the end of page
    await tab.executeScript("window.scrollTo(0, document.body.scrollHeight)");
}

async function HelpParseTweets(tweets_arr, all_tweets_on_page, n){
    // Iterate over each on n tweets
    // all_tweets_on_page_1 = await tab.findElements(By.css("[role='article']"));
    for(var i = 0 ; i < n; i++){
        var text = await all_tweets_on_page[i].getText();
        // var text = await all_tweets_on_page_1[i].getText();
        var arr = text.split('\n');
        var len_arr = arr.length;
        var index_end_post_content = len_arr -1;
        var after_post_index = 0;
        var inside_after_post_index = 0;
        var post_content_arr = new Array(); 


        // variables for json
        var is_retweet = undefined;
        var is_promoted = 0;
        var when_posted = undefined;
        var user_name = undefined;
        var user_url_name = undefined;
        var when_posted = undefined;
        var comments_amount = undefined;
        var retweets_amount = undefined;
        var likes_amount = undefined;
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
            when_posted = arr[4];
            after_post_index = 5;
            is_retweet = arr[0];
        }
        else if(arr.includes("Quote Tweet")){
            // Check if tweet is tweet sharing (quoting)
            user_name = arr[0];
            user_url_name = arr[1];
            when_posted = arr[3];
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
                when_posted:inside_when_posted,
                post_content:inside_post_content_arr,
                comments_amount:undefined,
                retweets_amount:undefined,
                likes_amount:undefined,
                is_retweet:undefined,
                is_promoted:undefined,
                shared_tweet:undefined
            }
            
        }
        else{
            // If it is a regular tweet
            user_name = arr[0];
            user_url_name = arr[1];
            when_posted = arr[3];
            after_post_index = 4;
        }

        after_post_index = await getTweetContent(after_post_index,index_end_post_content,arr,post_content_arr);
        if(arr.includes("Quote Tweet")){
            after_post_index = inside_after_post_index +1;
        }
        if(len_arr == after_post_index + 3){
            // This means none of comments/retweets/likes is 0
            comments_amount = arr[after_post_index];
            retweets_amount = arr[after_post_index + 1];
            likes_amount = arr[after_post_index + 2];
        }
        tweets_arr.push({
            user_name:user_name,
            user_url_name:user_url_name,
            when_posted:when_posted,
            post_content:post_content_arr,
            comments_amount:comments_amount,
            retweets_amount:retweets_amount,
            likes_amount:likes_amount,
            is_retweet:is_retweet,
            is_promoted:is_promoted,
            shared_tweet:shared_tweet
        });
    }
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

module.exports = {scrapeWhoToFollow : scrapeWhoToFollow, 
                get_n_first_tweets : get_n_first_tweets,
                scrollPage : scrollPage,
                scrollPost : scrollPost};