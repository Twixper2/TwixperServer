const selenium_communicator = require("../../business_logic/selenium_communicator/selenium_communicator.js");
const participantAuthUtils_selenium = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils_selenium");
const manipulator = require("../../business_logic/participant/manipulator/manipulator.js")
const config = require("../../config");
const userCookiesCollection = require("../../business_logic/db/mongodb/userCookiesCollection");
const expCollection = require("../../business_logic/db/mongodb/experimentsCollection");
const participantsCollection = require("../../business_logic/db/mongodb/participantsCollection");
const authorizeUser = require("../../business_logic/selenium_communicator/selenium_authorize/authorizeUser")
const bcrypt = require("bcryptjs");
const scrapeTwitter_moshe = require("../../business_logic/selenium_communicator/selenium_communicator");
const { cache } = require("ejs");
var {twitter_address,twitter_home_address, status_text, entity_constants, selenium_constants} = require("../../business_logic/twitter_communicator/static_twitter_data/ConstantsJSON.js");
const attribute_names = selenium_constants.attribute_names;
const attribute_values = selenium_constants.attribute_values;
const participantActionsOnTwitter = require("../../business_logic/participant/participant_actions/participantActionsOnTwitter.js")

const {By, Key, until} = require('selenium-webdriver');

const { Expo }  = require('expo-server-sdk');
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

/** ______Login_____ **/
async function logInProcess(params,access_token){
try{
    let new_tab = await participantAuthUtils_selenium.createNewTab();


    let login_response = undefined;
    let user = params.user;

    if(params?.cookies){
        login_response = await participantAuthUtils_selenium.logInProcessWithCookies(params,new_tab);
    }
    else{
        login_response = await participantAuthUtils_selenium.logInProcess(params,new_tab);
        if(login_response){
            //First login - saves the cookies and tokens of the user
            await new Promise(r => setTimeout(r, 2000));
            let allCookies = await new_tab.manage().getCookies();
            await userCookiesCollection.insertUserCookies(user,allCookies,access_token)
        }
    }
    if(login_response){
        // await new_tab.executeScript("document.body.style.zoom='30%'");

        let dets_to_save = {tab:new_tab, user:user, access_token:access_token};
        config.tabsHashMap.set(access_token, {...dets_to_save});
        params.tab = new_tab;
        params.access_token = access_token;
        return dets_to_save;

    }
    return login_response;
}
catch(e){
    console.log(e);
}

}

/**
 * 
 * @param {*} login_response - bool - if twitter verified the user
 * @param {*} params - Header params
 * @returns initialization values of the user account
 * */
async function firstLoginDataExtraction(login_response,params){

    let final_resp_without_tab = null;
    let new_tab = params.tab
    let user = params.user;
    let access_token = params.access_token;

    if(login_response){
        //open user profile page
        try{
            // await new_tab.wait(until.elementLocated(By.css("[data-testid='primaryColumn']")),5000);
        }
        catch(e){   
            console.log(e);
        }

        // Get initial content for participant
        let initial_content = await getInitialContentOfParticipant(new_tab,user);
        let dets_to_save = {tab:new_tab, user:user, access_token:access_token};
        // Save new tab to hashmap of selenium tabs
        let final_resp = {...dets_to_save, ...initial_content};
        final_resp_without_tab = Object.assign({}, final_resp);
        delete final_resp_without_tab.tab;
        delete final_resp_without_tab.user;
    }
    else{
        new_tab.close();
    }
    return final_resp_without_tab
}
/** ______User's initial content_____ **/

/**
 * 
 * @param {*} tab User current tab
 * @param {*} req_user User screen name
 * @returns The user profile info
 */
async function getInitialContentOfParticipant(tab,req_user){
    //open new tab
    await tab.executeScript(`window.open("${req_user}");`);
    // Wait for the new window or tab
    await tab.wait(async () => (await tab.getAllWindowHandles()).length === 2, 10000);
    // get the new window handle
    const windowsTab = await tab.getAllWindowHandles();
    const profileHandle = windowsTab[1];
    // switch to the new window handle
    await tab.switchTo().window(profileHandle);
    let userEntityDetails = await getUserEntityDetails({req_user},tab);
    //Close the profile page and return to the main page
    await tab.close();
    const mainTab = windowsTab[0];
    await tab.switchTo().window(mainTab);
    return userEntityDetails;
}



/** ______User's data_____ **/
async function getWhoToFollow(params=null,tab_from_calling_function=null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let whoToFollowElement = await selenium_communicator.scrapeWhoToFollow(tab_to_use)
        return whoToFollowElement;
    }
    return null;
} 

async function getFeed(params=null,tab_from_calling_function=null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let getFeed = await selenium_communicator.getFeed(tab_to_use);
        if (getFeed && params) {
            getFeed = await manipulator.manipulateTweets(params.participant, getFeed)
        }
        return getFeed;
    }
    return null;
}

async function getTweet(params = null,tab_from_calling_function = null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }
        let getTweet = await selenium_communicator.getTweet(tab_to_use,params.tweetUser,params.tweetIdStr);
        return getTweet;
    }
    return null;
}

/** ______User's profile content_____ **/
async function getUserEntityDetails(params = null,tab_from_calling_function = null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }
        let getUserEntityDetails = await selenium_communicator.getUserEntityDetails(tab_to_use,params.req_user);
        return getUserEntityDetails;
    }
    return null;
}

async function getUserTimeline(params = null,tab_from_calling_function = null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }

        let getUserTimeline = await selenium_communicator.getUserTimeline(tab_to_use,params.req_user);
        return getUserTimeline;
    }
    return null;
}

async function getUserLikes(params = null,tab_from_calling_function = null){
    if (params != null || tab_from_calling_function != null){
        let tab_to_use = null;

        if (tab_from_calling_function != null){
            tab_to_use = tab_from_calling_function;
        }
        else{
            tab_to_use = config.tabsHashMap.get(params.access_token);
        }
        let getUserLikes = await selenium_communicator.getUserLikes(tab_to_use,params.req_user);
        return getUserLikes;
    }
    return null;
}

/** ______Search for participant 2_____ **/

async function searchTweets(tab_from_calling_function, q){
    if (tab_from_calling_function != undefined){
        let getProfileContent = await selenium_communicator.getLatest_TweetsSearchResult(tab_from_calling_function,q);
        return getProfileContent;
    }
}
async function searchPeople(tab_from_calling_function,q){
    if (tab_from_calling_function != undefined){
        let getProfileContent = await selenium_communicator.getPeople_SearchResult(tab_from_calling_function, q);
        return getProfileContent;
    }
}
async function newTweetsSearch(tab_from_calling_function,q,){
    if (tab_from_calling_function != undefined){
        let searchResult = await selenium_communicator.newTweetsSearch(tab_from_calling_function,q);
        if (searchResult && params) {
            searchResult = await manipulator.manipulateTweets(params.participant, searchResult)
        }
        return searchResult;
    }
}
async function newPeopleSearch(tab_from_calling_function,q){
    if (tab_from_calling_function != undefined){
        let searchResult = await selenium_communicator.newPeopleSearch(tab_from_calling_function,q);
        return searchResult;
    }
}
async function getMoreSearchResult(tab_from_calling_function,mode){
    if (tab_from_calling_function != undefined){
        let searchResult = await selenium_communicator.getMoreSearchResult(tab_from_calling_function,mode);
        return searchResult;
    }
}

async function getNotifications(tab_from_calling_function){
    if (tab_from_calling_function != undefined){
        let notificationsResult = await selenium_communicator.getNotifications(tab_from_calling_function);
        return notificationsResult;
    }
}

async function closeSecondTab(tab_from_calling_function){
    if (tab_from_calling_function != undefined){
        await selenium_communicator.closeSecondTab(tab_from_calling_function);
        return true;
    }
}
async function postTweet(tab_from_calling_function,tweetContext){
    if (tab_from_calling_function != undefined){
        return await selenium_communicator.postTweet(tab_from_calling_function,tweetContext);;
    }
}

/** ______Register To Exp'_____ **/

async function registerParticipant(username, access_token, expCode){
    return await participantAuthUtils_selenium.registerParticipant(username, access_token, expCode);
}

function extractTwitterInfoFromParticipantObj(participant){
    return participantAuthUtils_selenium.extractTwitterInfoFromParticipantObj(participant)
}

async function tweetsAction(participant,tab_from_calling_function,tweet_id,screen_name,action,reply=undefined,ShareVia=undefined){
    if (tab_from_calling_function != undefined){
        let tweetsActionResults = await selenium_communicator.tweetsAction(tab_from_calling_function,tweet_id,screen_name,action,reply,ShareVia);
        if(tweetsActionResults?.label == "like"){
            participantActionsOnTwitter.likeTweet(participant,tweet_id,tweetsActionResults)
          }
    
          else if(tweetsActionResults?.label == "unlike"){
            participantActionsOnTwitter.unlikeTweet(participant,tweet_id,tweetsActionResults)
          }
    
          else if(tweetsActionResults?.label =="retweet"){
            // participantActionsOnTwitter.publishRetweet(participant,tweet_id,tweetsActionResults)
          }
    
          else if(tweetsActionResults?.label =="reply"){
            // participantActionsOnTwitter.logParticipantActions(participant,tweetsActionResults?.label,tweetsActionResults)
          }
        return tweetsActionResults;
    }
    return false;
}


/**
 * 
 */
async function checkForPushNotifications(){
    let tab = null
    let messages = [];
    try{
        //Draw all Active participants Cookies form DB
        let userInfo = await selenium_communicator.getAllUserCookie();

        //For all new tabs and check notifications
        for (let info of userInfo){
            //open new tabs
            tab = await participantAuthUtils_selenium.createNewTab();
            await PushNotificationsHandler(info,tab,messages);
            //close tab
            tab?.close();
        }
        // Only if there are any notification to send go to the sender function
        if(messages.length>0){
            sendNotificationsToServer(messages);
            console.log(messages);
        }
    }catch(e){
        console.log(e);
    }
    
}

/**
 * This function contains the logic of The check Notification,
 * it load the cookie 
 * parse the notifications 
 * and Organize them to send to the user
 * @param {*} info - current user cookie information from the DB
 * @param {*} tab - new tab the just open and waiting for cookie load
 * @param {*} messages - and array of messages to send to the users after finding notification.
 */
async function PushNotificationsHandler(info,tab,messages){
    try{ 
        if(info?.cookies){
            // info.cookies = await userCookiesDB.getCookiesByTwitterUserName(info._id);
            info.cookies.forEach((cookie) => {
                 tab.manage().addCookie(cookie);
            });
        }
        await tab.get("https://twitter.com/home");
        await selenium_communicator.tabWait(tab,5000);
        
        if(!await authorizeUser.logoutErrorHandler(tab)){
            await tab.navigate().refresh();
            await selenium_communicator.tabWait(tab,1000);
            await tab.navigate().refresh();
        }

        await selenium_communicator.tabWait(tab,4000);

        var notifications = await selenium_communicator.doIHaveNewNotifications(tab);
        if(notifications){
            let pushToken = info?.pushToken;
            console.log(notifications);
            
            //Send notification
            // Check that all your push tokens appear to be valid Expo push tokens
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
            }
            else{
                // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
                messages.push({
                    to: pushToken,
                    sound: 'default',
                    body: `This is a notification for ${info._id}`,
                    data: { notifications },
                })
            }

        }

    }catch(e){
        console.log(e);
    }

}

/**
 * This function was taken from expo's website
 * @param {*} messages - An array of messages, Each slot of the array is a different user.
 */
async function sendNotificationsToServer(messages){
    try{
        // The Expo push notification service accepts batches of notifications so
        // that you don't need to send 1000 requests to send 1000 notifications. We
        // recommend you batch your notifications to reduce the number of requests
        // and to compress them (notifications with similar content will get
        // compressed).
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            } catch (error) {
            console.error(error);
            }
        }
        })();



        // Later, after the Expo push notification service has delivered the
        // notifications to Apple or Google (usually quickly, but allow the the service
        // up to 30 minutes when under load), a "receipt" for each notification is
        // created. The receipts will be available for at least a day; stale receipts
        // are deleted.
        //
        // The ID of each receipt is sent back in the response "ticket" for each
        // notification. In summary, sending a notification produces a ticket, which
        // contains a receipt ID you later use to get the receipt.
        //
        // The receipts may contain error codes to which you must respond. In
        // particular, Apple or Google may block apps that continue to send
        // notifications to devices that have blocked notifications or have uninstalled
        // your app. Expo does not control this policy and sends back the feedback from
        // Apple and Google so you can handle it appropriately.
        let receiptIds = [];
        for (let ticket of tickets) {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
        if (ticket.id) {
            receiptIds.push(ticket.id);
        }
        }

        let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
        (async () => {
        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        for (let chunk of receiptIdChunks) {
            try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            console.log(receipts);

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (let receiptId in receipts) {
                let { status, message, details } = receipts[receiptId];
                if (status === 'ok') {
                continue;
                } else if (status === 'error') {
                console.error(
                    `There was an error sending a notification: ${message}`
                );
                if (details && details.error) {
                    // The error codes are listed in the Expo documentation:
                    // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                    // You must handle the errors appropriately.
                    console.error(`The error code is ${details.error}`);
                }
                }
            }
            } catch (error) {
            console.error(error);
            }
        }
        })();
    }catch(e){
        console.log(e);
    }
    
}

exports.logInProcess = logInProcess
exports.getWhoToFollow = getWhoToFollow
exports.getFeed = getFeed
exports.getUserEntityDetails = getUserEntityDetails
exports.searchTweets = searchTweets
exports.searchPeople = searchPeople
exports.newTweetsSearch = newTweetsSearch
exports.newPeopleSearch = newPeopleSearch
exports.getUserTimeline = getUserTimeline
exports.getUserLikes = getUserLikes
exports.getMoreSearchResult = getMoreSearchResult
exports.closeSecondTab = closeSecondTab
exports.postTweet=postTweet
exports.getTweet=getTweet
exports.registerParticipant=registerParticipant
exports.extractTwitterInfoFromParticipantObj=extractTwitterInfoFromParticipantObj
exports.tweetsAction=tweetsAction
exports.getNotifications=getNotifications
exports.firstLoginDataExtraction=firstLoginDataExtraction
exports.checkForPushNotifications=checkForPushNotifications
