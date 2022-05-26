const {By, Key, until} = require('selenium-webdriver');
const JS_SCROLL_BOTTOM = 'window.scrollTo(0, document.body.scrollHeight)';
const twitterInnerApiUrl = "https://twitter.com/i/api/2"

async function scrapeWhoToFollow(tab){
    var whoToFollowElement_x_path = "/html/body/div[1]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div[4]/aside/div[2]";
    var all_who_to_follow = await tab.findElement(By.xpath(whoToFollowElement_x_path));
    var all_buttons = await all_who_to_follow.findElements(By.css("[role='button']"));
    var all_images = await all_who_to_follow.findElements(By.css("img"));
    var img_1 = await all_images[0].getAttribute("src");
    var profile_names_arr = new Array();
    for(var i = 0 ; i < all_buttons.length; i++){
        var text = await all_buttons[i].getText();
        var arr = text.split('\n'); 
        for(var j = 0 ; j < arr.length; j++){
            if(arr[j] != "Follow" & arr[j] != "Promoted"){
                profile_names_arr.push(arr[j]);
            }
        }
    }
    // Adding names collected as username & and username with @ to the object to send
    var profile_names_arr_final = new Array();
    for(var j = 0 ; j < profile_names_arr.length; j = j + 2){
        if(j>0){
            var img_index = j/2;
            
        }
        else{
            img_index = j;
        }
        profile_names_arr_final.push({"user_name":profile_names_arr[j],"user_name_url":profile_names_arr[j+1],"img":await all_images[img_index].getAttribute("src")});
    }
    return profile_names_arr_final;
}

async function get_n_first_tweets(tab){
    var all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
    return await HelpParseTweets(all_tweets_on_page);
}

async function getUser(tab){
    // This will be operated after first login of user
}

async function scrollPost(tab){
    await tabWait(tab,2000);
    await tab.executeScript('window.scrollTo(0, 600)');
    await tabWait(tab,6000);
}

async function getProfileContent(tab,tweet_username){
    await tabWait(tab,200);
    await tab.get("https://twitter.com/"+tweet_username);
    let primary_column = await tab.findElement(By.css("[data-testid='primaryColumn']"));
    let json_details = await getPersonalDetailsFromProfileContent(primary_column);
    // await getTweetsTabFromProfileContent(tab);
    await getLikesTabFromProfileContent(tab);

    // return json_details;
}

async function postTweets(tab,tweet){
    console.log("starting search");
    await tabWait(tab,2000);
    await tab.findElement(By.css("[data-testid='tweetTextarea_0']")).sendKeys(tweet);
    await tabWait(tab,200);
    await tab.findElement(By.css("[data-testid='tweetButtonInline']")).sendKeys(Key.RETURN);
}
/**
 * 
 * @param {*} tab 
 * @param {*} query 
 * @param {*} count 
 * @returns 
 */
async function searchTwitterTweets(tab,query,mode="top"){
    // let searchTweetsUrl = "search?q="+query+"&src=typed_query&f="+ mode;
    //open new tab - search page
    // await tab.executeScript(`window.open("${searchTweetsUrl}");`);
    //save all open tabs handles
    // const windowTab = await tab.getAllWindowHandles();
    //switch to the new tab
    // await tab.switchTo().window(windowTab[1]);
    
    console.log("starting search");
    await tab.get("https://twitter.com/search?q="+query+"&src=typed_query&f="+ mode);
    await jumpToBottom(tab)
    //Brings the elements of the tweets
    let all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
    // parseTweets element
    let tweets =  await HelpParseTweets(all_tweets_on_page);
    //close search page
    // await tab.close();
    // go back to original window
    // await tab.switchTo().window(windowTab[0]);

    return tweets;
}

/**
 * 
 * @param {*} tab 
 * @param {*} query 
 * @param {*} count 
 * @returns 
 */
async function searchTwitterPeople(tab,query,count=40){
    console.log("starting search");
    await new Promise(r => setTimeout(r, 200));
    await tab.get("https://twitter.com/search?q="+query+"&src=typed_query&f=user");
    await jumpToBottom(tab);
    let all_People_on_page = await tab.findElements(By.css("[data-testid='cellInnerDiv']"));
    return await searchPeopleParse_Data(all_People_on_page);
}

/**
 * 
 * @param {*} tab 
 * 
 */
async function jumpToBottom(tab){
    console.log("starting jumpToBottom");
    await new Promise(r => setTimeout(r, 5000));
    await tab.executeScript("window.scrollBy(0,document.body.scrollHeight)");
    await new Promise(r => setTimeout(r, 2000));

    console.log("ending jumpToBottom");

}


async function getPersonalDetailsFromProfileContent(primary_column){
    let json_of_details = {};
    let cover_and_profile_img = await primary_column.findElements(By.css("img"));
    try{
        await retrieveCoverAndProfileImagesFromElement(json_of_details,cover_and_profile_img);
        json_of_details.username = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserName']")));
        let username = json_of_details.username.split("@")[1];
        json_of_details.following_count = await retrieveTextFromElement(await primary_column.findElements(By.css(`[href='/${username}/following']`)));
        json_of_details.followers_count = await retrieveTextFromElement(await primary_column.findElements(By.css(`[href='/${username}/followers']`)));
        json_of_details.user_description = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserDescription']")));
        json_of_details.user_location = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserLocation']")));
        await retrieveWhenJoinedFromElement(json_of_details,primary_column);
        json_of_details.user_url = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserUrl']")));
        json_of_details.user_profession = await retrieveTextFromElement(await primary_column.findElements(By.css("[data-testid='UserProfessionalCategory']")));
    }
    catch(error){
        // One of the elements has not been field by the user
        console.log(error);
    }
    finally{
        return json_of_details;
    }
}

async function retrieveWhenJoinedFromElement(json_of_details,primary_column){
    if(json_of_details.user_location == undefined){
        json_of_details.when_joined = await (await primary_column.findElements(By.css("[role='presentation']")))[0].getText();
    }
    else{
        json_of_details.when_joined = await (await primary_column.findElements(By.css("[role='presentation']")))[1].getText();
    }
}

async function retrieveCoverAndProfileImagesFromElement(json_of_details,cover_and_profile_img){
    if(cover_and_profile_img.length == 1){
        json_of_details.profile_img = await cover_and_profile_img[0].getAttribute("src");
        json_of_details.cover_photo = undefined;
    }
    else{
        json_of_details.cover_photo = await cover_and_profile_img[0].getAttribute("src");
        json_of_details.profile_img = await cover_and_profile_img[1].getAttribute("src");
    }
}

async function retrieveTextFromElement(e){
    if (e.length == 0){
        return undefined;
    }
    else{
        return await e[0].getText();
    }
}

async function getTweetsTabFromProfileContent(tab,n){
    await scrollPost(tab);
    return await get_n_first_tweets(tab,n);
}

async function getLikesTabFromProfileContent(tab){
    let tab_url = await tab.getCurrentUrl();
    await tab.get(tab_url+"/likes");
    await tabWait(tab,2000);
    let primary_column = await tab.findElement(By.css("[data-testid='primaryColumn']"));
    let all_likes_on_page = await primary_column.findElements(By.css("[role='article']"));
    let likes_arr = await helpParseLikes(tab,all_likes_on_page);
}

async function helpParseLikes(tab,all_likes_on_page){
    var likes_arr = new Array();
    for(let i=0; i<all_likes_on_page.length; i++){
        let like_links_arr = await all_likes_on_page[i].findElements(By.css("[role='link']"));
        let user_name = await like_links_arr[1].getText();
        let user_name_url = await like_links_arr[2].getText();
        let created_at = await like_links_arr[3].getText();
        
        let likes_comments_retweets_element = await all_likes_on_page[i].findElement(By.css("[role='group']"));
        let parent_of_parent = await likes_comments_retweets_element.findElement(By.xpath("../..")).getText();
        for(let j=0; j<parent_of_parent.length; j++){
            let x = await parent_of_parent[j].getText();
            let y=3;
        }
        
    }
}

async function getProfileLink(tweet){
    var profile_link = await tweet.findElement(By.css("[role='link']"));
    return await profile_link.getAttribute("href");
}

async function getTweetId(tweet){
    let links_components = await tweet.findElements(By.css("[role='link']"));
    for(let i=0; i<links_components.length; i++){
        let link_comp_url = await links_components[i].getAttribute("href");
        if(link_comp_url.includes("status")){
            let split_url_arr = link_comp_url.split("/");
            return split_url_arr[split_url_arr.length-1];
        }
    }
}

async function tabWait(tab,ms){
    try{
        // await tab.wait(() => {let x=0;}, ms);
        await new Promise(r => setTimeout(r, ms));

    }
    catch{
        return true;
    }    
}

/**
 * This function receives div tags with raw information about the search users and extracts the relevant information.
 * @param {*} User_on_page - A list of the div's that contain the raw information about the users
 * @returns - Information about the users who came up in the search
 */
async function searchPeopleParse_Data(User_on_page){
    var Users_arr = new Array();
    // Iterate over each on n User
    for(var k = 0 ; k < User_on_page.length; k++){
        var user = User_on_page[k];
        var all_buttons = await user?.findElements(By.css("[role='button']"));
        var all_images = await user?.findElements(By.css("img"));
        var img_1 = await all_images[0]?.getAttribute("src");
        for(var i = 0 ; i < all_buttons.length; i++){
            var text = await all_buttons[i]?.getText();
            var arr = text.split('\n');
            if(arr.length>1){
                Users_arr.push({"user_name":arr[0],"user_name_url":arr[1],"img":img_1,"FollowingStatus":arr[2]});
            }
        }
    }
    return Users_arr;
}

async function HelpParseTweets(all_tweets_on_page){
    var tweets_arr = new Array();
    // Iterate over each on n tweets
    for(var i = 0 ; i < all_tweets_on_page.length; i++){
        var tweet = all_tweets_on_page[i];

        var profile_link = await getProfileLink(tweet);
        var tweet_id = await getTweetId(tweet);

        var text = await tweet.getText();
        // To identify a poll on tweet
        // var x = await tweet.findElements(By.xpath("//div[data-testid='card.wrapper']"));
        var arr = text.split('\n');
        var len_arr = arr.length;
        var index_end_post_content = len_arr -1;
        var after_post_index = 0;
        var inside_after_post_index = 0;
        var full_text = new Array(); 

        // variables for json
        var is_retweet = undefined;
        var is_promoted = 0;
        var created_at = undefined;
        var user_name = undefined;
        var user_url_name = undefined;
        var comments_count = undefined;
        var retweets_count = undefined;
        var likes_count = undefined;
        var shared_tweet = undefined;

        // Conditions for parsing different tweets
        if(arr[len_arr-1] === "Promoted"){
            // Check if tweet is promoted tweet
            user_name = arr[0];
            user_url_name = arr[1];
            after_post_index = 2;
            is_promoted = 1;
        }
        else if(arr[0].includes("Retweeted")){
            // Check if tweet is Retweet
            user_name = arr[1];
            user_url_name = arr[2];
            created_at = arr[4];
            after_post_index = 5;
            is_retweet = arr[0];
        }
        else if(arr.includes("Quote Tweet")){
            // Check if tweet is tweet sharing (quoting)
            user_name = arr[0];
            user_url_name = arr[1];
            created_at = arr[3];
            after_post_index = 4;
            index_end_post_content = arr.indexOf("Quote Tweet");
            is_retweet = 0;

            // Now, figure out shared tweet's details

            // Getting ready inside tweet to load inside the json
            var inside_user_name = arr[index_end_post_content+1];
            var inside_user_url_name = arr[index_end_post_content+2];
            var inside_when_posted = arr[index_end_post_content+3].split(' ')[2];
            inside_after_post_index = index_end_post_content+4;
            var inside_post_content_arr = new Array();

            await getTweetContent(inside_after_post_index, len_arr, arr, inside_post_content_arr);
            
            // Modify pointer for comments, likes, retweets

            shared_tweet = {
                user_name:inside_user_name,
                user_url_name:inside_user_url_name,
                created_at:inside_when_posted,
                full_text:inside_post_content_arr,
                comments_count:undefined,
                retweets_count:undefined,
                likes_count:undefined,
                is_retweet:undefined,
                is_promoted:undefined,
                shared_tweet:undefined,
            }
            
        }
        else{
            // If it is a regular tweet
            user_name = arr[0];
            user_url_name = arr[1];
            created_at = arr[3];
            after_post_index = 4;
        }

        after_post_index = await getTweetContent(after_post_index,index_end_post_content,arr,full_text);
        if(arr.includes("Quote Tweet")){
            after_post_index = inside_after_post_index +1;
        }
        if(len_arr == after_post_index + 3){
            // This means none of comments/retweets/likes is 0
            comments_count = arr[after_post_index];
            retweets_count = arr[after_post_index + 1];
            likes_count = arr[after_post_index + 2];
        }
        tweets_arr.push({
            user_name,
            user_url_name,
            created_at,
            full_text,
            comments_count,
            retweets_count,
            likes_count,
            is_retweet,
            is_promoted,
            shared_tweet,
            profile_link,
            tweet_id
        });
    }
    return tweets_arr;
}

async function getTweetContent(after_post_index,index_end_post_content,arr,post_content_arr){
    // Push first line of content
    post_content_arr.push(arr[after_post_index]);
    // Iterate over arr to get amount of post rows
    for(var j = 1 ; j < index_end_post_content; j++){
        // Get arr range for post content
        if(!/^\d+$/.test(arr[j+after_post_index]) && arr[j+after_post_index] != "Quote Tweet"){
            post_content_arr.push(arr[j+after_post_index]);
        }
        else{
            after_post_index = j+after_post_index;
            break;
        } 
    }
    return after_post_index;
}

async function reloadPage(tab){
    tab.navigate().refresh();
}


module.exports = {
                getUser : getUser,
                scrapeWhoToFollow : scrapeWhoToFollow, 
                get_n_first_tweets : get_n_first_tweets,
                getProfileContent : getProfileContent,
                scrollPost : scrollPost,
                searchTwitterTweets : searchTwitterTweets,
                searchTwitterPeople : searchTwitterPeople,
                postTweets: postTweets

                };