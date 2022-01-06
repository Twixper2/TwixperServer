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

// Define window size
tab.manage().window().maximize();
  
// Get the credentials from the JSON file
var data = require("./CredentialsJSON.js");
var user = data.user;
var pass = data.pass;

  
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
        // Return username input
        return tab.findElement(By.name("text"));
    })
    .then(function (usernameBox) {
  
        // Step 3 - Entering the username
        var promiseFillUsername =
            usernameBox.sendKeys("colabmail");
        // Click on Next
        tab.findElement(By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div[6]")).sendKeys(Key.RETURN);
        return promiseFillUsername;
    })
    .then(function () {
        console.log(
            "Username entered successfully in " +
            "'login demonstration' for twitter"
        );
  
        // Return password input
        let promisePasswordBox =
        tab.findElement(By.name("password")).sendKeys("LiadMosheDini");
        return promisePasswordBox;
    })
    .then(function () {
        console.log(
            "Password entered successfully in " +
            " 'login demonstration' for twitter"
        );
  
        // Step 6 - Finding the Log In button
        let promiseSignInBtn = tab.findElement(By.xpath("//html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div"))
        return promiseSignInBtn;
    })
    .then(function (signInBtn) {
        // Wait before log in button pressing
        tab.wait(function(){
            return 3<5;
        },1); 
        // Step 7 - Clicking the Log In button
        let promiseClickSignIn = signInBtn.sendKeys(Key.RETURN);
        tab.manage().getCookies().then(function (cookies) {
            console.log(cookies);
        }); 
        return promiseClickSignIn;
    })
    .then(function () {
        console.log("Successfully signed in twitter!");
    })
    .catch(function (err) {
        console.log("Error ", err, " occurred!");
    });