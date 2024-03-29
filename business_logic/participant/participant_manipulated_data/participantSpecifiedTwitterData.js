const twitterComm = require("../../twitter_communicator/twitterCommunicator")
const twitterInnerApiUtils = require("../../twitter_communicator/twitter_internal_api/twitterInnerApiUtils")
const axios = require('axios')
const cheerio = require('cheerio');

async function getUser(username){
    const twitterGetUser = await twitterComm.getUser(username)
    
    return twitterGetUser
}

async function getTweet(tweetId){
    let tweetObj = await twitterComm.getTweet(tweetId)
    tweetObj = twitterInnerApiUtils.formatTweetPageObject(tweetObj, tweetId)
    // If this is a retweet, find and attach the original tweet's comments
    if(tweetObj.retweeted_status_id_str != null){
        const originalTweet = await twitterComm.getTweet(tweetObj.retweeted_status_id_str) 
        const commentsArr = twitterInnerApiUtils.formatTweetComments(originalTweet)
        tweetObj.comments = commentsArr
    }
    return tweetObj
}

async function getUserFriends(participant, username){
    const twitterGetUserFriends = await twitterComm.getUserFriends(participant, username)
    return twitterGetUserFriends
}

async function getUserFollowers(participant, username){
    const twitterGetUserFollowers = await twitterComm.getUserFollowers(participant, username)
    return twitterGetUserFollowers
}

async function getUserTimeline(userId, count=40){
    let twitterGetUserTimeline = await twitterComm.getUserTimeline(userId, count)
    twitterGetUserTimeline = twitterInnerApiUtils.formatUserTimelineObject(twitterGetUserTimeline)
    return twitterGetUserTimeline
}

async function getUserTimelineFromOfficialApi(participant, userName, count=10){
  let twitterGetUserTimeline = await twitterComm.getUserTimelineFromOfficialApi(participant, userName, count)
  return twitterGetUserTimeline
}

async function getUserLikes(participant, username){
    const twitterGetUserLikes = await twitterComm.getUserLikes(participant, username)
    return twitterGetUserLikes
}

async function getLinkPreview(previewUrl){
    const html = await axios.get(previewUrl, {
      timeout: 2500
    }).then(res => res.data).catch(res => null)
    if(html == null){
      console.log("Link preview timeout, returning only domain name")
      let domain = new URL(previewUrl).hostname
      if(domain.startsWith("www.")){
        domain = domain.substring(4)
      }
      return {
        domain: domain,
        title: null,
        img: null,
      }
    }
    const $ = cheerio.load(html);
    const getMetaTag = (name) =>  {
      return(
        $(`meta[name=${name}]`).attr('content') ||
        $(`meta[name="og:${name}"]`).attr('content') ||
        $(`meta[name="twitter:${name}"]`).attr('content') ||
        $(`meta[property=${name}]`).attr('content') ||
        $(`meta[property="og:${name}"]`).attr('content') ||
        $(`meta[property="twitter:${name}"]`).attr('content')
      );
    }
    const siteUrl = getMetaTag('url') || previewUrl
    let domain = new URL(siteUrl).hostname
    if(domain.startsWith("www.")){
      // Trim the www initail
      domain = domain.substring(4)
    }
    const metaTagData = {
      domain: domain,
      title: getMetaTag('title') || $(`h1`).text() || null,
      img: getMetaTag('image') || null,
    }
    return metaTagData
}


exports.getUser = getUser
exports.getTweet = getTweet
exports.getUserFriends = getUserFriends
exports.getUserFollowers = getUserFollowers
exports.getUserTimeline = getUserTimeline
exports.getUserTimelineFromOfficialApi = getUserTimelineFromOfficialApi
exports.getUserLikes = getUserLikes
exports.getLinkPreview = getLinkPreview
