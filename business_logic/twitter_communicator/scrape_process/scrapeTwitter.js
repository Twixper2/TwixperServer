const { json } = require("express");
// const { ConsoleMessage } = require("puppeteer");
// var zeromq = require("zeromq");
// var socket = zeromq.createSocket('rep');

// async function dataTransformationToScrape(port,selenium_cookies){
//     if(selenium_cookies != undefined){
//         socket.bind("tcp://127.0.0.1:"+port,
//         function(err)
//         {
//             if (err) throw err;
//             console.log("Bound to port "+port+".");

//             socket.on('message', function(envelope, blank, data)
//                       {
//                         // envelope.toString('utf8') => the message received from the other side
//                         // console.log();
//                         // console.log(selenium_cookies);
//                         var cookies_parsed = JSON.stringify(selenium_cookies);
//                         // socket.send(envelope.toString('utf8') + cookies_parsed);
//                         socket.send(cookies_parsed);
//                       });

//             socket.on('error', function(err) {
//                 console.log("Error: "+err);
//             });
//         }
//         );
//     }  
// }

async function scrapeWhoToFollow(tab){
    const {Builder, By, Key, until} = require('selenium-webdriver');
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
    return profile_names_arr;
}

async function get_n_first_tweets(tab,n){
    const {Builder, By, Key, until} = require('selenium-webdriver');
    var all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
    // Validate input n - number of tweets to retrieve
    if(!(/^\d+$/.test(n) && n > 0 && n <= all_tweets_on_page.length)){
        return 'Input n failed!';
    }
    var tweets_arr = new Array();
    await HelpParseTweets(tweets_arr, all_tweets_on_page, n);
    return tweets_arr; 
}

async function HelpParseTweets(tweets_arr, all_tweets_on_page, n){
    // Iterate over each on n tweets
    for(var i = 0 ; i < n; i++){
        var text = await all_tweets_on_page[i].getText();
        var arr = text.split('\n');
        var len_arr = arr.length;
        var after_post_index = 0;
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
        else{
            // If it is a regular tweet
            user_name = arr[0];
            user_url_name = arr[1];
            when_posted = arr[3];
            after_post_index = 4;
        }

        // Push first line of content
        post_content_arr.push(arr[after_post_index]);
        // Iterate over arr to get amount of post rows
        for(var j = 1 ; j < len_arr-1; j++){
            // Get arr range for post content
            if(!/^\d+$/.test(arr[j+after_post_index])){
                post_content_arr.push(arr[j+after_post_index]);
            }
            else{
                after_post_index = j+after_post_index;
                break;
            } 
        }

        comments_amount = arr[after_post_index]
        retweets_amount = arr[after_post_index + 1] 
        likes_amount = arr[after_post_index + 2]  

        tweets_arr.push({
            user_name:user_name,
            user_url_name:user_url_name,
            when_posted:when_posted,
            post_content:post_content_arr,
            comments_amount:comments_amount,
            retweets_amount:retweets_amount,
            likes_amount:likes_amount,
            is_retweet:is_retweet,
            is_promoted:is_promoted
        });
    }
}

module.exports = {scrapeWhoToFollow : scrapeWhoToFollow, get_n_first_tweets : get_n_first_tweets};