// first write in terminal
// npm install selenium-webdriver
// npm install chromedriver

// had to download chrome driver 97


const {Builder, By, Key, until} = require('selenium-webdriver');
// Include the chrome driver
require("chromedriver");
  


// Include selenium webdriver
let swd = require("selenium-webdriver");
let browser = new swd.Builder();
let tab = browser.forBrowser("chrome").build();
  
// Get the credentials from the JSON file
var data = require("./CredentialsJSON.js");
let { user, pass } = data
  
// Step 1 - Opening the twitter sign in page
let tabToOpen =
    tab.get("https://twitter.com/i/flow/login");
tabToOpen
    .then(function () {
  
        // Timeout to wait if connection is slow
        let findTimeOutP =
            tab.manage().setTimeouts({
                implicit: 10000, // 10 seconds
            });
        return findTimeOutP;
    })
    .then(function () {

        // Step 2 - insert username and password
        // tab.findElement(By.name("text")).sendKeys("Twixper_App");
        // Go Next
        // tab.findElement(By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div[6]")).sendKeys(Key.RETURN);
        // // Insert Password
        // tab.findElement(By.name("password")).sendKeys("LiadMosheDini");
        // // Go Login
        // tab.findElement(By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div/div")).sendKeys(Key.RETURN);


        return tab.findElement(By.name("text"));
    })
    .then(function (usernameBox) {
  
        // Step 3 - Entering the username
        var promiseFillUsername =
            usernameBox.sendKeys("Twixper_App");
        // Go Next
        tab.findElement(By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div[6]")).sendKeys(Key.RETURN);
        return promiseFillUsername;
    })
    .then(function () {
        console.log(
            "Username entered successfully in" +
            "'login demonstration' for twitter"
        );
  
        // Step 4 - Finding the password input
        let promisePasswordBox =
        tab.findElement(By.name("password")).sendKeys("LiadMosheDini");
        return promisePasswordBox;
    })
    .then(function () {
        console.log(
            "Password entered successfully in" +
            " 'login demonstration' for twitter"
        );
  
        // Step 6 - Finding the Log In button
        let promiseSignInBtn = tab.findElement(By.xpath("//html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div"))
        return promiseSignInBtn;
    })
    .then(function (signInBtn) {
  
        // Step 7 - Clicking the Log In button

        tab.wait(function(){
            return 3<5;
        },1); 

        let promiseClickSignIn = signInBtn.sendKeys(Key.RETURN);
    
        // let promiseClickSignIn = signInBtn.sendKeys(Key.RETURN);
        return promiseClickSignIn;
    })
    .then(function () {
        console.log("Successfully signed in twitter!");
    })
    .catch(function (err) {
        console.log("Error ", err, " occurred!");
    });