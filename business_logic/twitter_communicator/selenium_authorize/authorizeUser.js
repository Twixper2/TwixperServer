// first write in terminal
// npm install selenium-webdriver
// npm install chromedriver

// pip install webdriver-manager

// Solve compatibility problem with following:
// npm install chromedriver
// npm install chromedriver --save-dev #if you need it as a dev dependency
// npm install

async function createNewTab(){
    const {Builder} = require('selenium-webdriver');
    // Include the chrome driver
    require("chromedriver");
    // Include selenium webdriver
    let swd = require("selenium-webdriver");
    let browser = new swd.Builder();
    let tab = browser.forBrowser("chrome").build();
    // Define window size
    tab.manage().window().maximize();
    return tab;
}  

async function logInProcess(data,tab){

    const {By, Key} = require('selenium-webdriver');

    var user = data.user;
    var pass = data.pass;
    // Step 1 - Opening the twitter sign in page
    var tabToOpen = await tab.get("https://twitter.com/i/flow/login");
    // Timeout to wait if connection is slow
    var findTimeOutP = await tab.manage().setTimeouts({
        implicit: 10000, // 10 seconds
    });
    // Return username input
    var usernameBox = await tab.findElement(By.name("text"));
    // Step 3 - Entering the username
    var promiseFillUsername = await usernameBox.sendKeys(user);
    // Click on Next
    var username_x_path = "/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[5]/label/div/div[2]/div/input";
    await tab.findElement(By.xpath(username_x_path)).sendKeys(Key.RETURN);
    console.log("Username entered successfully in " + "'login demonstration' for twitter");
    // Return password input
    var promisePasswordBox = await tab.findElement(By.name("password")).sendKeys(pass);
    console.log("Password entered successfully in " + " 'login demonstration' for twitter");
    // Step 6 - Finding the Log In button
    var signInBtn_x_path = "/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]";
    var promiseSignInBtn = await tab.findElement(By.xpath(signInBtn_x_path));
    // Wait before log in button pressing
    await tab.wait(function(){
        return 3<5;
    },1); 
    // Step 7 - Clicking the Log In button
    var promiseClickSignIn = await promiseSignInBtn.sendKeys(Key.RETURN);
    console.log("Successfully signed in twitter!");
    // Cookies expire time is:
    // Time / 24 * 60 * 60 * 1000 = x [days]
    var cookies = await tab.manage().getCookies();
    // console.log(cookies);
    // Send cookies to python - beautifulsoup
    // return cookies;
    return "Successfully signed in twitter!";
}

module.exports = {logInProcess : logInProcess, 
                createNewTab : createNewTab};
