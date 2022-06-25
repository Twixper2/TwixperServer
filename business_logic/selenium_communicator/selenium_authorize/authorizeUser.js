const {By, Key, until, Builder} = require('selenium-webdriver');
const login_url = "https://twitter.com/i/flow/login";
const home_url = "https://twitter.com/home";
const userCookiesDB = require("../../db/mongodb/userCookiesCollection");
const {isHeadless} = require("../../../config.js");
const {auth_constants} = require("../../../business_logic/twitter_communicator/static_twitter_data/ConstantsJSON.js");


async function createNewTab(){
    try{
        // Include selenium webdriver
        require('chromedriver');
        let swd = require("selenium-webdriver");
        let tab = null;
        const chrome = require('selenium-webdriver/chrome');

        if(isHeadless){
            tab = new Builder().forBrowser('chrome')
            .setChromeOptions(new chrome.Options().addArguments('--headless'))
            .build()
        }
        else{
            let browser = new swd.Builder();
            tab = new Builder().forBrowser('chrome')
            .setChromeOptions(new chrome.Options())
            .build()
        }

        tab.manage().window().maximize();
        await tab.executeScript("document.body.style.zoom='30%'");


        return tab;
    }
    catch(error){
        console.log('error creating new tab');
    }
}  

async function insertUserName(tab,user){
    try{
        // await tab.wait(until.elementLocated(By.name("text")),5000);

        // Entering the username
        await tab.findElement(By.name("text")).sendKeys(user);
        // Click on Next
        await tab.findElement(By.xpath(auth_constants.username_x_path)).sendKeys(Key.RETURN);
        // Change timeout so it will not stuck while checking for alert element for element for too long
        await tab.manage().setTimeouts({
            implicit: 500, // 0.5 seconds
        });
        return true;
    }
    catch(error){
        console.log('error with insertUserName');
        return false;
    }
}

async function insertPasswordAndLogin(tab,pass){
    try{
        // await tab.wait(until.elementLocated(By.name("password")),5000);

        // Return password input
        await tab.findElement(By.name("password")).sendKeys(pass);
        // Clicking the Log In button
        await tab.findElement(By.css("[data-testid='LoginForm_Login_Button']")).sendKeys(Key.RETURN);
        return true;
    }
    catch(error){
        console.log('error with insertPasswordAndLogin');
        return false;
    }
}

async function isUserCredentialsValid(tab){
    try{
        // await tab.wait(until.elementLocated(By.css("[role='alert']")),1000);

        // There is a 'Wrong Password' alert
        await tab.findElement(By.css("[role='alert']")).getText();
        return false;
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
async function loadUserCookie(tab, username, allCookies=undefined){
    try{
        if(!allCookies)
            allCookies = await userCookiesDB.getCookiesByTwitterUserName(username);
        allCookies.forEach(element => {
            tab.manage().addCookie(element)
        });
        return tab;
    }catch(e){
        return tab;
    }
}

/**
 * The function receives the page from which the user logged in and retrieves the cookies from it
 * @param {*} tab - chrome web driver
 * @param {*} username - user tweeter name 
 * @returns boolean val of the oppression 
 */
async function saveUserCookie(tab, username,allCookies=undefined){
    try{
        
        let allCookies = await tab.manage().getCookies();
        await userCookiesDB.insertUserCookies(username,allCookies);
        return true;
    }catch(e){
        return false;
    }

}
/**
 * 
 * @param {*} data - The information the been givin in the req 
 * @param {*} tab - Current web page
 * @returns interest the user's tab session information from the database (if its not is first conation)
 */
async function logInProcessWithCookies(data,tab){
    try{
        let allCookies = data.cookies; 
        let username = data.user;   
        await loadUserCookie(tab, username, allCookies);
        await tab.get(home_url);
        console.log("Successfully signed in twitter!");
        return true;
    }catch(e){
        return false;
    }
}

async function logInProcess(data,tab){
    try{
        await tab.get(login_url);
        // Timeout to wait if connection is slow
        await tab.manage().setTimeouts({
            implicit: 10000, // 10 seconds
        });
        // Step 2 - Entering the username
        if(!await insertUserName(tab,data.user)){
            return false;
        }
        // validation of username
        if(!await isUserCredentialsValid(tab)){
            console.log('username does not exist');
            return false;
        }
        // Step 3 - Entering the password
        if(!await insertPasswordAndLogin(tab,data.pass)){
            return false;
        }
        // validation of password
        if(await isUserCredentialsValid(tab)){
            console.log("Successfully signed in twitter!");
            //Waiting for the home page with the cookies to load before pulling them out
            return true;
        }
        else{
            console.log('password and username does not match');
            return false;
        }
    }   
    catch(error){
        console.log(error);
    }
}

module.exports = 
    {
        logInProcess : logInProcess, 
        createNewTab : createNewTab,
        saveUserCookie : saveUserCookie,
        loadUserCookie : loadUserCookie,
        logInProcessWithCookies : logInProcessWithCookies
    };
