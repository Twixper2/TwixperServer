var authorizeUser = require("./selenium_authorize/authorizeUser.js");
var scrapeTwitter = require("./scrapy_use_auth/scrapeTwitter.js");
var credentials = require("./static_twitter_data/CredentialsJSON.js");

async function mainRun(){
    // Retrieve user credentials
    var user_credentials = credentials.credentials;
    // Log in to twitter and get cookies
    
    var cookies = await authorizeUser.logInProcess(user_credentials);

    // Next - send cookies to beautifulsoup in Python
    var port = 5502;
    await scrapeTwitter.dataTransformationToScrape(port,cookies);


}
mainRun();
