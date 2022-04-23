// first write in terminal
// npm install selenium-webdriver
// npm install chromedriver

// pip install webdriver-manager

// Solve compatibility problem with following:
// npm install chromedriver
// npm install chromedriver --save-dev #if you need it as a dev dependency
// npm install
const {By, Key, until, Builder} = require('selenium-webdriver');

async function createNewTab(){
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

async function insertUserName(tab,user){
    // Return username input
    var usernameBox = await tab.findElement(By.name("text"));
    // Step 3 - Entering the username
    var promiseFillUsername = await usernameBox.sendKeys(user);
    // Click on Next
    var username_x_path = "/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[5]/label/div/div[2]/div/input";
    await tab.findElement(By.xpath(username_x_path)).sendKeys(Key.RETURN);
}

async function insertPasswordAndLogin(tab,pass){
    // Return password input
    await tab.findElement(By.name("password")).sendKeys(pass);
    // Step 6 - Finding the Log In button
    var promiseSignInBtn = await tab.findElement(By.css("[data-testid='LoginForm_Login_Button']"));
    // Step 7 - Clicking the Log In button
    await promiseSignInBtn.sendKeys(Key.RETURN);
    // Change timeout so it will not check for element for too long
    await tab.manage().setTimeouts({
        implicit: 500, // 0.5 seconds
    });
}

async function isUserCredentialsValid(tab){
    try{
        // There is a 'Wrong Password' alert
        return await tab.findElement(By.css("[role='alert']")).getText();
    }
    catch(error){
        // Error - no such element, so no error alert
        return true;
    }
}

async function logInProcess(data,tab){
    // Step 1 - Opening the twitter sign in page
    await tab.get("https://twitter.com/i/flow/login");
    // Timeout to wait if connection is slow
    await tab.manage().setTimeouts({
        implicit: 10000, // 10 seconds
    });
    // Step 2 - Entering the username
    await insertUserName(tab,data.user);
    // Step 3 - Entering the password
    await insertPasswordAndLogin(tab,data.pass);
    // validation of password
    var validation_result = await isUserCredentialsValid(tab);
    if(validation_result == true){
        console.log("Successfully signed in twitter!");
        return "Successfully signed in twitter!";
    }
    else{
        console.log(validation_result);
        return validation_result;
    }
}

module.exports = {logInProcess : logInProcess, 
                createNewTab : createNewTab};
