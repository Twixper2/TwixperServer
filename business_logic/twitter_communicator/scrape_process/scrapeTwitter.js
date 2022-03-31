const { json } = require("express");
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
    var element = await tab.findElement(By.xpath(whoToFollowElement_x_path));
    return element.getText();
}

async function get_5_tweets(tab){
    const {Builder, By, Key, until} = require('selenium-webdriver');
    var all_tweets_on_page = await tab.findElements(By.css("article"));
    var profile_img = all_tweets_on_page[0].getAttribute("img")[0];
    // for(var i =0 ; i< all_tweets_on_page.length(); i++){
    //     // Tweet's profile img
    //     var profile_img = all_tweets_on_page[i].findElements(By.css("img")[0]);
    // }
    return 5;
}

module.exports = {dataTransformationToScrape : dataTransformationToScrape,
                scrapeWhoToFollow : scrapeWhoToFollow, get_5_tweets : get_5_tweets};