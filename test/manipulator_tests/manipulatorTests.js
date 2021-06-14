// Requiring modules
var manipulator = require("../../business_logic/participant/manipulator/manipulator")
var data = require("./dataForManipulatorTests")
var common = require("../common");
var assert = common.assert;
var expect = common.expect;
var participant = {
	participant_twitter_username: "avi",
	group_manipulations: data.manipulations
}

describe("Manipulator tests", () => {
	it("tweets is null", async () => {
		await expect(manipulator.manipulateTweets(participant, null)).to.eventually.be.rejected
		// assert.throws(function (){
		// 	manipulator.manipulateTweets(participant, null)
		// })
	});
	it("manipulations is null", async () => {
		const tweets = [data.tweet1]
		let p = {
			participant_twitter_username: "premierleague",
			group_manipulations: null
		}
		await expect(manipulator.manipulateTweets(p, tweets)).to.eventually.be.rejected
		// assert.throws(function (){
		// 	manipulator.manipulateTweets(p, tweets)
		// })
	});
	it("participant is null", async () => {
		const tweets = [data.tweet1]
		await expect(manipulator.manipulateTweets(null, tweets)).to.eventually.be.rejected
		// assert.throws(function (){
		// 	manipulator.manipulateTweets(null, tweets)
		// })
	});
	it("Participant is the tweet's author", async () => {
		const tweets = [data.tweet1]
		let p = {
			participant_twitter_username: "premierleague",
			group_manipulations: data.manipulations
		}
		const result = await manipulator.manipulateTweets(p, tweets)
		assert.equal(result.length, 1)
	});
	it("Participant is mentioned", async () => {
		const tweets = [data.tweetWithLfcMentioned]
		let p = {
			participant_twitter_username: "LFC",
			group_manipulations: data.manipulations
		}
		const result = await manipulator.manipulateTweets(p, tweets)
		assert.equal(result.length, 1)
	});
	it("One of the users in the manipulation wrote this tweet", async () => {
		const tweets = [data.tweet1]
		const result = await manipulator.manipulateTweets(participant, tweets)
		assert.equal(result.length, 0)
	});
	it("One of the hashtags in tweet is in the keywords", async () => {
		const tweets = [data.tweet1]
		const result = await manipulator.manipulateTweets(participant, tweets)
		assert.equal(result.length, 0)
	});
	it("The tweet's text contains a keyword", async () => {
		const tweets = [data.tweet1]
		const result = await manipulator.manipulateTweets(participant, tweets)
		assert.equal(result.length, 0)
	});
	it("The tweet is a retweet and one of the users in the manipulation wrote the original tweet", async () => {
		const tweets = [data.retweet]
		const result = await manipulator.manipulateTweets(participant, tweets)
		assert.equal(result.length, 0)
	});
	it("The tweet is a retweet and the participant is retweeted", async () => {
		const tweets = [data.retweet]
		let p = {
			participant_twitter_username: "LFC",
			group_manipulations: data.manipulations
		}
		const result = await manipulator.manipulateTweets(p, tweets)
		assert.equal(result.length, 1)
	});
	it("The tweet is a retweet and one of the hashtags in the original tweet is in the keywords", async () => {
		const tweets = [data.retweet]
		const result = await manipulator.manipulateTweets(participant, tweets)
		assert.equal(result.length, 0)
	});
	it("The tweet is a qoute and the participant is the quoted author", async () => {
		const tweets = [data.quote]
		let p = {
			participant_twitter_username: "CAPEUSA",
			group_manipulations: data.manipulations
		}
		const result = await manipulator.manipulateTweets(p, tweets)
		assert.equal(result.length, 1)
	});
	it("The tweet is a quote and one of the users in the manipulation wrote the quoted tweet", async () => {
		const tweets = [data.quote]
		const result = await manipulator.manipulateTweets(participant, tweets)
		assert.equal(result.length, 0)
	});
	it("The tweet is a quote and one of the hashtags in the quoted tweet is in the keywords", async () => {
		const tweets = [data.quote]
		const result = await manipulator.manipulateTweets(participant, tweets)
		assert.equal(result.length, 0)
	});
	it("The tweet is a quote and the quoted tweet's text contains one of the keywords", async () => {
		const tweets = [data.quote]
		const result = await manipulator.manipulateTweets(participant, tweets)
		assert.equal(result.length, 0)
	});
	it("The tweet is not matched to manipulation", async () => {
		const tweets = [data.innocentTweet]
		const result = await manipulator.manipulateTweets(participant, tweets)
		assert.equal(result.length, 1)
	});
});