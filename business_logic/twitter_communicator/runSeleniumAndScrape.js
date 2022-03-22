var authorizeUser = require("./selenium_authorize/authorizeUser.js");
var scrapeTwitter = require("./scrapy_use_auth/scrapeTwitter.js");
var credentials = require("./static_twitter_data/CredentialsJSON.js");


function mainRun(){
    // Retrieve user credentials
    var user_credentials = credentials.credentials;
    // Log in to twitter and get cookies
    var port = 5502;


    authorizeUser.logInProcess(user_credentials)
    .then(cookies => {
        console.log("after first than");
        console.log(cookies);
        scrapeTwitter.dataTransformationToScrape(port,cookies)
        .then(res => {
            console.log("after second than");
        })
    })




    // authorizeUser.logInProcess(user_credentials).then(function (cookies) {
    //     setTimeout(undefined, 2);
    //     console.log("cookies after than");
    //     console.log(cookies)
    //     // Next - send cookies to beautifulsoup in Python
    //     scrapeTwitter.dataTransformationToScrape(port,cookies).then(function () {
    //         console.log("here");
    //     });
    // })


    

    
}

mainRun();
