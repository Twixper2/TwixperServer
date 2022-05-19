const {By, Key, until} = require('selenium-webdriver');
const homepage_url = "https://twitter.com/i/flow/login";
const userCookiesDB = require("../../db/mongodb/userCookiesCollection");
const headless = false;


async function createNewTab(){
    // Include selenium webdriver
    require('chromedriver');
    let swd = require("selenium-webdriver");
    let tab = null;

    if(headless){
        const chrome = require('selenium-webdriver/chrome');
        tab = new Builder().forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments('--headless'))
        .build()
    }
    else{
        let browser = new swd.Builder();
        tab = browser.forBrowser("chrome").build();
    }

    tab.manage().window().maximize();

    return tab;
}  

async function insertUserName(tab,user){
    // Entering the username
    // await tab.findElement(By.name("text")).sendKeys(user);
    let test = await tab.findElement(By.name("text")).sendKeys(user);
    // Click on Next
    var username_x_path = "/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[5]/label/div/div[2]/div/input";
    await tab.findElement(By.xpath(username_x_path)).sendKeys(Key.RETURN);
}

async function insertPasswordAndLogin(tab,pass){
    // Return password input
    await tab.findElement(By.name("password")).sendKeys(pass);
    // Clicking the Log In button
    await tab.findElement(By.css("[data-testid='LoginForm_Login_Button']")).sendKeys(Key.RETURN);
    // Change timeout so it will not stuck while checking for alert element for element for too long
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
 /**
  * The function receives a new page and insert the user cookies of the page he logged in from
  * @param {*} tab - chrome web driver
  * @param {*} username - user tweeter name 
  * @returns chrome web driver with user cookies inside
  */
async function loadUserCookie(tab, username){
    try{
        let allCookies = await userCookiesDB.getCookiesByTwitterUserName(username);
        allCookies.forEach(element => {
            tab.manage().addCookie(element)
        });
        return tab;
    }catch(e){
        return null;
    }

}

/**
 * The function receives the page from which the user logged in and retrieves the cookies from it
 * @param {*} tab - chrome web driver
 * @param {*} username - user tweeter name 
 * @returns boolean val of the oppression 
 */
async function saveUserCookie(tab, username){
    try{
        let allCookies = await tab.manage().getCookies();
        await userCookiesDB.insertUserCookies(username,allCookies);
        return true;
    }catch(e){
        return false;
    }

}

async function logInProcess(data,tab){
    await tab.get(login_url);
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
        //Waiting for the home page with the cookies to load before pulling them out
        await new Promise(r => setTimeout(r, 2000));

        await saveUserCookie(tab, data.user)
        
        return true;
    }
    else{
        console.log(validation_result);
        return false;
    }
}

module.exports = 
    {
            logInProcess : logInProcess, 
            createNewTab : createNewTab,
            saveUserCookie : saveUserCookie,
            loadUserCookie : loadUserCookie
    };
