const { json } = require("express");
const { ConsoleMessage } = require("puppeteer");
var zeromq = require("zeromq");
var socket = zeromq.createSocket('rep');

async function dataTransformationToScrape(port,selenium_cookies){
    if(selenium_cookies != undefined){
        socket.bind("tcp://127.0.0.1:"+port,
        function(err)
        {
            if (err) throw err;
            console.log("Bound to port "+port+".");

            socket.on('message', function(envelope, blank, data)
                      {
                        // envelope.toString('utf8') => the message received from the other side
                        // console.log();
                        // console.log(selenium_cookies);
                        var cookies_parsed = JSON.stringify(selenium_cookies);
                        // socket.send(envelope.toString('utf8') + cookies_parsed);
                        socket.send(cookies_parsed);
                      });

            socket.on('error', function(err) {
                console.log("Error: "+err);
            });
        }
        );
    }  
}

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

async function get_5_tweets(tab){
    const {Builder, By, Key, until} = require('selenium-webdriver');
    var all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
    // var profile_img = all_tweets_on_page[0].getAttribute("img")[0];
    var tweets_arr = new Array();
    for(var i = 0 ; i < all_tweets_on_page.length; i++){
        var text = await all_tweets_on_page[i].getText();
        var arr = text.split('\n');
        var post_content_arr = new Array(); 
        var after_post_index = 4;
        // First line push
        post_content_arr.push(arr[4]);
        
        // If arr[8] is Promoted -> change values of dict
        // If arr[0] contains Retweeted -> is it a retweet

        // Iterate over arr to get row length of post content
        for(var j = 1 ; j < arr.length-1; j++){
            // Get arr range for post content
            if(!/^\d+$/.test(arr[j+4])){
                post_content_arr.push(arr[j+4]);
                after_post_index += 1;
            }
            else{
                break;
            } 
        }
        var single_tweet_json = {
            user_name:arr[0],
            user_url_name:arr[1],
            when_posted:arr[3],
            post_content:post_content_arr,
            comments_amount:arr[after_post_index+1],
            retweets_amount:arr[after_post_index+2],
            likes_amount:arr[after_post_index+3]
        }
        tweets_arr.push(single_tweet_json);
    }
    console.log(tweets_arr);
    // for(var i =0 ; i< all_tweets_on_page.length(); i++){
    //     // Tweet's profile img
    //     var profile_img = all_tweets_on_page[i].findElements(By.css("img")[0]);
    // }
    return 5;
}

module.exports = {dataTransformationToScrape : dataTransformationToScrape,
                scrapeWhoToFollow : scrapeWhoToFollow, get_5_tweets : get_5_tweets};