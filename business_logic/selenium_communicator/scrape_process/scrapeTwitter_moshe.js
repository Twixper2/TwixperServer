const { By, Key, until } = require("selenium-webdriver");
const JS_SCROLL_BOTTOM = "window.scrollTo(0, document.body.scrollHeight)";
const twitterInnerApiUrl = "https://twitter.com/i/api/2";
const { HelpParseTweets, isProfileVerified } = require("./scrapeTwitter");

async function scrapeWhoToFollow(tab) {
	var whoToFollowElement_x_path =
		"/html/body/div[1]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div[4]/aside/div[2]";
	var all_who_to_follow = await tab.findElement(By.xpath(whoToFollowElement_x_path));
	var all_buttons = await all_who_to_follow.findElements(By.css("[role='button']"));
	var all_images = await all_who_to_follow.findElements(By.css("img"));
	var img_1 = await all_images[0].getAttribute("src");
	var profile_names_arr = new Array();
	for (var i = 0; i < all_buttons.length; i++) {
		var text = await all_buttons[i].getText();
		var arr = text.split("\n");
		for (var j = 0; j < arr.length; j++) {
			if ((arr[j] != "Follow") & (arr[j] != "Promoted")) {
				profile_names_arr.push(arr[j]);
			}
		}
	}
	// Adding names collected as username & and username with @ to the object to send
	var profile_names_arr_final = new Array();
	for (var j = 0; j < profile_names_arr.length; j = j + 2) {
		if (j > 0) {
			var img_index = j / 2;
		} else {
			img_index = j;
		}
		profile_names_arr_final.push({
			user_name: profile_names_arr[j],
			user_name_url: profile_names_arr[j + 1],
			img: await all_images[img_index].getAttribute("src"),
		});
	}
	return profile_names_arr_final;
}

async function get_n_first_tweets(tab) {
	var all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
	return await HelpParseTweets(all_tweets_on_page);
}

async function getUser(tab) {
	// This will be operated after first login of user
}

async function scrollPost(tab) {
	await tabWait(tab, 2000);
	await tab.executeScript("window.scrollTo(0, 600)");
	await tabWait(tab, 6000);
}

async function getProfileContent(tab, tweet_username) {
	// save all open tabs handles
	const windowTab = await tab.getAllWindowHandles();
	// switch to the new tab
	await tab.switchTo().window(windowTab[1]);

	try {
		let primary_column = await tab.findElement(By.css("[data-testid='primaryColumn']"));
		let json_details = await getPersonalDetailsFromProfileContent(primary_column);
		// await getTweetsTabFromProfileContent(tab);
		// await getLikesTabFromProfileContent(tab);
		await tab.close();
		await tab.switchTo().window(windowTab[0]);
		return json_details;
	} catch (error) {
		console.log(error);
		await tab.close();
		await tab.switchTo().window(windowTab[0]);
	}
}

async function postTweets(tab, tweet) {
	try {
		await tabWait(tab, 2000);
		console.log("starting post");
		const windowTab = await tab.getAllWindowHandles();
		// switch to the main page
		await tab.switchTo().window(windowTab[0]);
		// await tabWait(tab,2000);
		await tab.findElement(By.css("[data-testid='tweetTextarea_0']")).sendKeys(tweet);
		await tabWait(tab, 200);
		await tab.findElement(By.css("[data-testid='tweetButtonInline']")).sendKeys(Key.RETURN);
		try {
			// await tabWait(tab,2000);
			await tab.wait(async () => (await tab.findElement(By.css("[aria-live='assertive']")), 5000));

			let err = await tab.findElement(By.css("[aria-live='assertive']"));
			let message = await err.getText();
			if (message.includes("Whoops! You already said that.")) {
				await tab.navigate().refresh();
				return false;
			}
			return true;
		} catch (error) {
			console.log(error);
			return true;
		}
	} catch (error) {
		console.log(error);
	}
}

async function getNotifications(tab) {
	try {
		console.log("getting notifications");
		if ((await tab.getAllWindowHandles()).length != 2) {
			// open new tab - search page
			await tab.executeScript(`window.open("notifications");`);
		} else {
			tab.get("https://twitter.com/notifications");
		}
		await tabWait(tab, 4000);

		// save all open tabs handles
		const windowTab = await tab.getAllWindowHandles();
		// switch to the new tab
		await tab.switchTo().window(windowTab[1]);
		let all_notifications_on_page = await tab.findElements(By.css("[role='article']"));
		let notifications = await notificationsDataManager(all_notifications_on_page);
		return notifications;
	} catch (error) {
		console.log(error);
		await tab.close();
		let mainTab = (await tab.getAllWindowHandles())[0];
		await tab.switchTo().window(mainTab);
	}
}

/**
 *
 * @param {*} tab - The user's current webdriver
 * @returns Continues to return more notifications in current session
 */
async function getMoreNotifications(tab) {
	await jumpToBottom(tab);
	//Brings the elements of the notifications
	let all_notifications_on_page = await tab.findElements(By.css("[role='article']"));
	// parse notifications element
	let notifications = await notificationsDataManager(all_notifications_on_page);
	return notifications;
}

async function doIHaveNewNotifications(tab) {
	try {
		// if((await tab.getAllWindowHandles()).length != 2 ){
		//     // open new tab - search page
		//     await tab.executeScript(`window.open("home");`);
		//     await tabWait(tab,3000);
		// }
		// // save all open tabs handles
		// const windowTab = await tab.getAllWindowHandles();
		// // switch to the new tab
		// await tab.switchTo().window(windowTab[1]);

		let notificationsBellStatus = await tab
			.findElement(By.css("[href='/notifications']"))
			.getAttribute("aria-label");

		if (notificationsBellStatus == "Notifications") {
			return false;
		}

		let numOfNotifications = notificationsBellStatus.match(/(\d+)/)[0];

		console.log("starting notifications check");
		if ((await tab.getAllWindowHandles()).length != 2) {
			// open new tab - search page
			await tab.executeScript(`window.open("notifications");`);
			await tabWait(tab, 3000);
		}
		let all_notifications_on_page = await tab.findElement(By.css("[role='article']"));
		let lestNotifications = await notificationsParseData(all_notifications_on_page);
		let notificationType = lestNotifications.notificationType;

		switch (notificationType) {
			case "Alerts":
				break;
			case "like":
				break;
			case "Retweeted":
				break;
			case "Suggestions":
				break;
			default:
				break;
		}
		return notifications;
	} catch (error) {
		console.log(error);
		await tab.close();
		let mainTab = (await tab.getAllWindowHandles())[0];
		await tab.switchTo().window(mainTab);
	}
}
/**
 *
 * @param {*} tab - user page
 * @param {*} tweet_id - of the tweet we want to add actions to
 * @param {*} screen_name - the screen_name of the user that the tweet id is belong to
 * @param {*} action - what action you want to add or remove? reply/retweet/like/Share Tweet
 * @param {*} reply
 * @returns
 */
async function tweetsActionManager(tab, tweet_id, screen_name, action, reply = undefined, ShareVia = undefined) {
	try {
		console.log("starting addEmotionToTweets");

		var currUrl = screen_name + "/status/" + tweet_id;
		await tab.executeScript(`window.open("${currUrl}");`);
		await tabWait(tab, 5000);
		const windowTab = await tab.getAllWindowHandles();
		// switch to the main page
		const newTabHandle = windowTab[windowTab.length - 1];
		await tab.switchTo().window(newTabHandle);

		let tweet = await tab.findElements(By.css("[role='article']"));
		var tweet_buttons = await tweet[0]?.findElements(By.css("[role='button']"));
		let label = undefined;
		let button = undefined;

		//getting the relent button
		for (var i = 0; i < tweet_buttons.length; i++) {
			label = (await tweet_buttons[i].getAttribute("aria-label")).toLocaleLowerCase();
			//check if its a like action
			if (action.toLocaleLowerCase() == "like") {
				// if the label is like its mean we still didn't like this post - add like
				if (label == "like") {
					button = tweet_buttons[i];
					break;
				}
				// if the label is liked its mean we did like this post - remove like
				else if (label == "liked") {
					button = tweet_buttons[i];
					break;
				}
			}

			if (action.toLocaleLowerCase() == "retweet") {
				// if the label is like its mean we still didn't retweet this post - add retweet

				if (label == "retweet") {
					button = tweet_buttons[i];
					break;
				}
				// if the label is retweeted its mean we did retweet this post - remove retweet
				else if (label == "retweeted") {
					button = tweet_buttons[i];
					break;
				}
			}
			//for reply action
			if (action.toLocaleLowerCase() == label) {
				button = tweet_buttons[i];
				break;
			}
		}

		if (label == "like" || label == "liked") {
			return await likeHandler(button);
		} else if (label == "reply") {
			return await replyHandler(tab, button, reply);
		} else if (label == "retweet") {
			return await retweetHandler(tab, button);
		} else if (label == "retweeted") {
			return await retweetedHandler(tab, button);
		} else {
			return undefined;
		}
	} catch (e) {
		console.log(e);
		return "There was a problem with " + action;
	} finally {
		await tabWait(tab, 1000);
		await tab.close();
		let mainTab = (await tab.getAllWindowHandles())[0];
		await tab.switchTo().window(mainTab);
	}
}
async function likeHandler(button) {
	try {
		await button?.sendKeys(Key.RETURN);
		return "like action has been fulfilled";
	} catch (e) {
		console.log(e);
		return "There was a problem adding 'like' action";
	}
}
async function replyHandler(tab, button, reply) {
	try {
		await button?.sendKeys(Key.RETURN);
		await tabWait(tab, 500);
		await tab.findElement(By.css("[data-testid='tweetTextarea_0']")).sendKeys(reply);
		await tabWait(tab, 500);
		await tab.findElement(By.css("[data-testid='tweetButton']")).sendKeys(Key.RETURN);
		await tabWait(tab, 1000);
		return "reply action has been fulfilled";
	} catch (e) {
		console.log(e);
		return "There was a problem adding 'reply' action";
	}
}
async function retweetHandler(tab, button) {
	try {
		await button?.sendKeys(Key.RETURN);
		await tabWait(tab, 500);
		await tab.findElement(By.css("[data-testid='retweetConfirm']")).sendKeys(Key.RETURN);
		await tabWait(tab, 500);
		return "retweet action has been fulfilled";
	} catch (e) {
		console.log(e);
		return "There was a problem adding 'retweet' action";
	}
}
async function retweetedHandler(tab, button) {
	try {
		await button?.sendKeys(Key.RETURN);
		await tabWait(tab, 500);
		await tab.findElement(By.css("[data-testid='unretweetConfirm']")).sendKeys(Key.RETURN);
		await tabWait(tab, 500);
		return "retweet action has been fulfilled";
	} catch (e) {
		console.log(e);
		return "There was a problem adding 'retweet' action";
	}
}
async function quoteTweetsHandler(button) {
	try {
		await button?.sendKeys(Key.RETURN);
		await tabWait(tab, 200);
		await tab.findElement(By.css("[href='/compose/tweet']")).sendKeys(Key.RETURN);
		await tabWait(tab, 200);
		return "retweet action has been fulfilled";
	} catch (e) {
		return "There was a problem adding 'retweet' action";
	}
}
/**---------------Attempt to allow to added emoji ------------------ */
// async function postTweets(tab,tweet){
//     try{
//         await tabWait(tab,2000);
//         var text_element = await tab.findElement(By.css("[data-testid='tweetTextarea_0']"));
//         tab.executeScript(`arguments[0].innerHTML = '${tweet}'`, text_element)
//         text_element .sendKeys('.')
//         text_element .sendKeys(Key.RETURN)
//         await tab.findElement(By.css("[data-testid='tweetButtonInline']")).sendKeys(Key.RETURN);
//     }catch(error){
//         console.log(error);
//     }
// }

/**
 *
 * @param {*} tab
 * @param {*} query
 * @param {*} count
 * @returns
 */
async function searchTwitterTweets(tab, query, mode = "top") {
	// let searchTweetsUrl = "search?q="+query+"&src=typed_query&f="+ mode;
	// open new tab - search page
	// await tab.executeScript(`window.open("${searchTweetsUrl}");`);
	// save all open tabs handles
	// const windowTab = await tab.getAllWindowHandles();
	// switch to the new tab
	// await tab.switchTo().window(windowTab[1]);

	console.log("starting search");
	await tab.get("https://twitter.com/search?q=" + query + "&src=typed_query&f=" + mode);
	await jumpToBottom(tab);
	//Brings the elements of the tweets
	let all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
	// parseTweets element
	let tweets = await HelpParseTweets(all_tweets_on_page);
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
async function searchTwitterPeople(tab, query, count = 40) {
	console.log("starting search");
	// await new Promise(r => setTimeout(r, 200));
	await tab.get("https://twitter.com/search?q=" + query + "&src=typed_query&f=user");
	await jumpToBottom(tab);
	let all_People_on_page = await tab.findElements(By.css("[data-testid='cellInnerDiv']"));
	return await searchPeopleParse_Data(all_People_on_page);
}

/*-------------------------------------new search on twitter function--------------------------------------------*/

/**
 *
 * @param {*} tab - The user's current webdriver
 * @param {*} query - rep params
 * @param {*} mode - live/top {live- recent tweets || top- most popular tweets}
 * @returns The tweets received from the search
 */
async function openTweetsSearchTab(tab, query, mode = "live") {
	try {
		let searchUrl = "search?q=" + query + "&src=typed_query&f=" + mode;
		console.log("starting new search");
		if ((await tab.getAllWindowHandles()).length != 2) {
			// open new tab - search page
			await tab.executeScript(`window.open("${searchUrl}");`);
		} else {
			tab.get("https://twitter.com/" + searchUrl);
		}

		// save all open tabs handles
		const windowTab = await tab.getAllWindowHandles();

		// switch to the new tab
		await tab.switchTo().window(windowTab[1]);
		await new Promise((r) => setTimeout(r, 3000));
		//Brings the elements of the tweets
		let all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
		// parseTweets element
		let tweets = await HelpParseTweets(all_tweets_on_page);
		return tweets;
	} catch (error) {
		console.log(error);
		closeSearchTweets(tab);
	}
}

/**
 *
 * @param {*} tab - The user's current webdriver
 * @param {*} query - rep params
 * @param {*} mode - live/top {live- recent tweets || top- most popular tweets}
 * @returns The tweets received from the search
 */
async function openPeopleSearchTab(tab, query) {
	try {
		let searchUrl = "search?q=" + query + "&src=typed_query&f=user";
		console.log("starting new search");
		if ((await tab.getAllWindowHandles()).length != 2) {
			// open new tab - search page
			await tab.executeScript(`window.open("${searchUrl}");`);
		} else {
			tab.get("https://twitter.com/" + searchUrl);
		}

		// save all open tabs handles
		const windowTab = await tab.getAllWindowHandles();

		// switch to the new tab
		await tab.switchTo().window(windowTab[1]);

		await new Promise((r) => setTimeout(r, 3000));

		//Brings the elements of the tweets
		let all_People_on_page = await tab.findElements(By.css("[data-testid='cellInnerDiv']"));
		// parseTweets element
		let tweets = await searchPeopleParse_Data(all_People_on_page);
		return tweets;
	} catch (error) {
		console.log(error);
		closeSearchTab(tab);
	}
}

/**
 *
 * @param {*} tab - The user's current webdriver
 * @returns Continues to return more tweets in current search session
 */
async function getMoreSearchResult(tab, mode) {
	await jumpToBottom(tab);
	if (mode == "tweets") {
		//Brings the elements of the tweets
		let all_tweets_on_page = await tab.findElements(By.css("[role='article']"));
		// parseTweets element
		let tweets = await HelpParseTweets(all_tweets_on_page);
		return tweets;
	}
	if (mode == "people") {
		let all_People_on_page = await tab.findElements(By.css("[data-testid='cellInnerDiv']"));
		let people = await searchPeopleParse_Data(all_People_on_page);
		return people;
	}
}

/**
 *
 * @param {*} tab - The user's current webdriver
 * @returns  close search session
 */
async function closeSecondTab(tab) {
	const windowTab = await tab.getAllWindowHandles();
	//close search page
	await tab.close();
	// go back to original window
	await tab.switchTo().window(windowTab[0]);
	return;
}

/*-------------------------------------------help func ----------------------------------------------*/
/**
 * Jumps to the next load point of the page
 */
async function jumpToBottom(tab) {
	console.log("starting jumpToBottom");
	await new Promise((r) => setTimeout(r, 2000));
	await tab.executeScript("window.scrollBy(0,document.body.scrollHeight)");
	await new Promise((r) => setTimeout(r, 3000));
	// console.log("ending jumpToBottom");
}

async function getPersonalDetailsFromProfileContent(primary_column) {
	let json_of_details = {};
	let cover_and_profile_img = await primary_column.findElements(By.css("img"));
	try {
		await retrieveCoverAndProfileImagesFromElement(json_of_details, cover_and_profile_img);
		json_of_details.username = await retrieveTextFromElement(
			await primary_column.findElements(By.css("[data-testid='UserName']"))
		);
		let username = json_of_details.username.split("@")[1];
		json_of_details.following_count = await retrieveTextFromElement(
			await primary_column.findElements(By.css(`[href='/${username}/following']`))
		);
		json_of_details.followers_count = await retrieveTextFromElement(
			await primary_column.findElements(By.css(`[href='/${username}/followers']`))
		);
		json_of_details.user_description = await retrieveTextFromElement(
			await primary_column.findElements(By.css("[data-testid='UserDescription']"))
		);
		json_of_details.user_location = await retrieveTextFromElement(
			await primary_column.findElements(By.css("[data-testid='UserLocation']"))
		);
		await retrieveWhenJoinedFromElement(json_of_details, primary_column);
		json_of_details.user_url = await retrieveTextFromElement(
			await primary_column.findElements(By.css("[data-testid='UserUrl']"))
		);
		json_of_details.user_profession = await retrieveTextFromElement(
			await primary_column.findElements(By.css("[data-testid='UserProfessionalCategory']"))
		);
	} catch (error) {
		// One of the elements has not been field by the user
		console.log(error);
	} finally {
		return json_of_details;
	}
}

async function retrieveWhenJoinedFromElement(json_of_details, primary_column) {
	if (json_of_details.user_location == undefined) {
		json_of_details.when_joined = await (
			await primary_column.findElements(By.css("[role='presentation']"))
		)[0].getText();
	} else {
		json_of_details.when_joined = await (
			await primary_column.findElements(By.css("[role='presentation']"))
		)[1].getText();
	}
}

async function retrieveCoverAndProfileImagesFromElement(json_of_details, cover_and_profile_img) {
	if (cover_and_profile_img.length == 1) {
		json_of_details.profile_img = await cover_and_profile_img[0].getAttribute("src");
		json_of_details.cover_photo = undefined;
	} else {
		json_of_details.cover_photo = await cover_and_profile_img[0].getAttribute("src");
		json_of_details.profile_img = await cover_and_profile_img[1].getAttribute("src");
	}
}

async function retrieveTextFromElement(e) {
	if (e.length == 0) {
		return undefined;
	} else {
		return await e[0].getText();
	}
}

async function getTweetsTabFromProfileContent(tab, n) {
	await scrollPost(tab);
	return await get_n_first_tweets(tab, n);
}

async function getLikesTabFromProfileContent(tab) {
	let tab_url = await tab.getCurrentUrl();
	await tab.get(tab_url + "/likes");
	await tabWait(tab, 2000);
	let primary_column = await tab.findElement(By.css("[data-testid='primaryColumn']"));
	let all_likes_on_page = await primary_column.findElements(By.css("[role='article']"));
	let likes_arr = await helpParseLikes(tab, all_likes_on_page);
}

async function helpParseLikes(tab, all_likes_on_page) {
	var likes_arr = new Array();
	for (let i = 0; i < all_likes_on_page.length; i++) {
		let like_links_arr = await all_likes_on_page[i].findElements(By.css("[role='link']"));
		let user_name = await like_links_arr[1].getText();
		let user_name_url = await like_links_arr[2].getText();
		let created_at = await like_links_arr[3].getText();

		let likes_comments_retweets_element = await all_likes_on_page[i].findElement(By.css("[role='group']"));
		let parent_of_parent = await likes_comments_retweets_element.findElement(By.xpath("../..")).getText();
		for (let j = 0; j < parent_of_parent.length; j++) {
			let x = await parent_of_parent[j].getText();
			let y = 3;
		}
	}
}

async function getProfileLink(tweet) {
	var profile_link = await tweet.findElement(By.css("[role='link']"));
	return await profile_link.getAttribute("href");
}

async function getTweetId(tweet) {
	let links_components = await tweet.findElements(By.css("[role='link']"));
	for (let i = 0; i < links_components.length; i++) {
		let link_comp_url = await links_components[i].getAttribute("href");
		if (link_comp_url.includes("status")) {
			let split_url_arr = link_comp_url.split("/");
			return split_url_arr[split_url_arr.length - 1];
		}
	}
}

async function tabWait(tab, ms) {
	try {
		// await tab.wait(() => {let x=0;}, ms);
		await new Promise((r) => setTimeout(r, ms));
	} catch {
		return true;
	}
}

/**
 * This function receives div tags with raw information about the search users and extracts the relevant information.
 * @param {*} User_on_page - A list of the div's that contain the raw information about the users
 * @returns - Information about the users who came up in the search
 */
async function searchPeopleParse_Data(User_on_page) {
	var Users_arr = new Array();
	// Iterate over each on n User
	for (var k = 0; k < User_on_page.length; k++) {
		var user = User_on_page[k];
		var all_buttons = await user?.findElements(By.css("[role='button']"));
		var all_images = await user?.findElements(By.css("img"));
		var img_1 = await all_images[0]?.getAttribute("src");
		for (var i = 0; i < all_buttons.length; i++) {
			var text = await all_buttons[i]?.getText();
			let is_profile_verified = (await isProfileVerified(all_buttons[i])) > 0 ? true : false;

			var arr = text.split("\n");
			if (arr.length > 1) {
				Users_arr.push({
					name: arr[0],
					screen_name: arr[1],
					img: img_1,
					FollowingStatus: arr[2],
					description: arr[3],
					is_profile_verified: is_profile_verified,
				});
			}
		}
	}
	return Users_arr;
}
async function tweet_NotificationsHandler(notification) {
	try {
		let f = await notification.getAttribute("data-testid");
		let tweet_ids = await getTweetId(notification);

		// console.log("tweet");
		var all_links = await notification?.findElements(By.css("[role='link']"));

		var all_images = await all_links[0]?.findElements(By.css("img"));

		var profile_img_url = await all_images[0]?.getAttribute("src");
		var user_name = await all_links[1]?.getText();
		var screen_name = await (await all_links[2]?.getText()).replace("@", "");
		var profile_link = "https://twitter.com/" + screen_name;
		var timeAgo = await all_links[3]?.getText();

		var replyTo = new Array();

		for (var i = 4; i < all_links.length; i++) {
			var screen_name = await (await all_links[i]?.getText()).replace("@", "");

			var user = {
				screen_name: screen_name,
				profile_link: "https://twitter.com/" + screen_name,
			};
			replyTo.push(user);
		}

		var all_buttons = await notification?.findElements(By.css("[role='button']"));

		var buttonsInfo = await getButtonInfo(all_buttons);

		var fullText = await notification.findElement(By.css("[data-testid='tweetText']")).getText();
		return {
			notificationType: "tweet",
			tweet_ids: tweet_ids,
			user: {
				name: user_name,
				screen_name: screen_name,
			},
			created_at: timeAgo,
			profile_img_url: profile_img_url,
			profile_link: profile_link,
			replyTo: replyTo,
			buttons: buttonsInfo,
			body_text: fullText,
		};
	} catch (e) {
		throw e;
	}
}
async function alerts_NotificationsHandler(notification) {
	var notificationText = await (await notification.findElement(By.css("[dir='ltr']")).getText()).replace("\n", " ");
	return {
		notificationType: "Alerts",
		title_text: notificationText,
	};
}
async function notificationsDataManager(notifications_on_page) {
	try {
		var notifications_arr = new Array();
		// Iterate over each on n User
		for (var k = 0; k < notifications_on_page.length; k++) {
			var notification = notifications_on_page[k];
			let f = await notification.getAttribute("data-testid");
			if (f == "tweet") {
				notifications_arr.push(await tweet_NotificationsHandler(notification));
			} else {
				// console.log("not tweet")
				var pathTag = await notification?.findElement(By.tagName("path"));
				var notificationSVG = await pathTag?.getAttribute("d");
				var notificationsType = notificationsIconsType(notificationSVG);

				if (notificationsType == "Alerts") {
					notifications_arr.push(await alerts_NotificationsHandler(notification));
				} else if (notificationsType) {
					var all_links = await notification?.findElements(By.css("[role='link']"));
					var all_images = await all_links[0]?.findElements(By.css("img"));
					var img = await all_images[0]?.getAttribute("src");
					var profile_link = await (
						await notification.findElement(By.css("[role='link']"))
					)?.getAttribute("href");
					var screen_name = await profile_link.replace("https://twitter.com/", "");
					var ltr_div = await notification.findElement(By.css("[dir='ltr']"));
					var span_div = await ltr_div.findElements(By.css("span"));

					var user_name = await span_div[0].getText();
					var notificationText = await ltr_div.getText();

					if (user_name.includes("In case you missed")) {
						user_name = await span_div[3].getText();
					}

					var fullText = await notification?.findElement(By.css("[data-testid='tweetText']")).getText();
					notifications_arr.push({
						notificationType: notificationsType,
						user: {
							name: user_name,
							screen_name: screen_name,
						},
						profile_img_url: img,
						profile_link: profile_link,
						title_text: notificationText,
						body_text: fullText,
					});
				}
			}
		}
		return notifications_arr;
	} catch (e) {
		throw e;
	}
}

/**
 *
 * @param {*} all_buttons - All buttons tags in the notification - comment/reTweet/likes/shared - Relevant to tweets only
 * @returns Mapping them by each button type and quantity of itb
 */
async function getButtonInfo(all_buttons) {
	var comment = (await all_buttons[1]?.getText()) == "" ? 0 : await all_buttons[1]?.getText();
	var reTweet = (await all_buttons[2]?.getText()) == "" ? 0 : await all_buttons[2]?.getText();
	var likes = (await all_buttons[3]?.getText()) == "" ? 0 : await all_buttons[3]?.getText();
	var shared = (await all_buttons[4]?.getText()) == "" ? 0 : await all_buttons[4]?.getText();

	return {
		comments_count: comment,
		retweets_count: reTweet,
		likes_count: likes,
		shared: shared,
	};
}

/**
 *
 * @param {*} notificationSVG - The path of the alert icon
 * @returns What kind of notification icon is it - (problematic because something may change in the future)
 */
function notificationsIconsType(notificationSVG) {
	var like =
		"M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z";
	var Retweeted =
		"M23.615 15.477c-.47-.47-1.23-.47-1.697 0l-1.326 1.326V7.4c0-2.178-1.772-3.95-3.95-3.95h-5.2c-.663 0-1.2.538-1.2 1.2s.537 1.2 1.2 1.2h5.2c.854 0 1.55.695 1.55 1.55v9.403l-1.326-1.326c-.47-.47-1.23-.47-1.697 0s-.47 1.23 0 1.697l3.374 3.375c.234.233.542.35.85.35s.613-.116.848-.35l3.375-3.376c.467-.47.467-1.23-.002-1.697zM12.562 18.5h-5.2c-.854 0-1.55-.695-1.55-1.55V7.547l1.326 1.326c.234.235.542.352.848.352s.614-.117.85-.352c.468-.47.468-1.23 0-1.697L5.46 3.8c-.47-.468-1.23-.468-1.697 0L.388 7.177c-.47.47-.47 1.23 0 1.697s1.23.47 1.697 0L3.41 7.547v9.403c0 2.178 1.773 3.95 3.95 3.95h5.2c.664 0 1.2-.538 1.2-1.2s-.535-1.2-1.198-1.2z";
	var Suggestions =
		"M22.99 11.295l-6.986-2.13-.877-.326-.325-.88L12.67.975c-.092-.303-.372-.51-.688-.51-.316 0-.596.207-.688.51l-2.392 7.84-1.774.657-6.148 1.82c-.306.092-.515.372-.515.69 0 .32.21.6.515.69l7.956 2.358 2.356 7.956c.09.306.37.515.69.515.32 0 .6-.21.69-.514l1.822-6.15.656-1.773 7.84-2.392c.303-.09.51-.37.51-.687 0-.316-.207-.596-.51-.688z";
	var Alerts =
		"M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z";
	if (notificationSVG == like) {
		return "like";
	}
	if (notificationSVG == Retweeted) {
		return "Retweeted";
	}
	if (notificationSVG == Suggestions) {
		return "Suggestions";
	}
	if (notificationSVG == Alerts) {
		return "Alerts";
	} else {
		return undefined;
	}
}

module.exports = {
	getUser: getUser,
	scrapeWhoToFollow: scrapeWhoToFollow,
	get_n_first_tweets: get_n_first_tweets,
	getProfileContent: getProfileContent,
	scrollPost: scrollPost,
	searchTwitterTweets: searchTwitterTweets,
	searchTwitterPeople: searchTwitterPeople,
	postTweets: postTweets,

	openTweetsSearchTab: openTweetsSearchTab,
	openPeopleSearchTab: openPeopleSearchTab,
	getMoreSearchResult: getMoreSearchResult,
	closeSecondTab: closeSecondTab,
	getNotifications: getNotifications,
	getMoreNotifications: getMoreNotifications,
	tweetsActionManager: tweetsActionManager,
	doIHaveNewNotifications: doIHaveNewNotifications,
};
