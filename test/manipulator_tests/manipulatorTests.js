// Requiring modules
var manipulator = require("../../business_logic/participant/manipulator/manipulator")
var data = require("./dataForManipulatorTests")
var common = require("../common");
var assert = common.assert;

describe("Manipulator tests", () => {
	it("tweets is null", async () => {
		assert.throws(function (){
			manipulator.manipulateTweets(data.manipulations, null, "premierleague")
		})
	});
	it("manipulations is null", async () => {
		const tweets = [data.tweet1]
		assert.throws(function (){
			manipulator.manipulateTweets(null, tweets, "premierleague")
		})
	});
	it("participantUsername is null", async () => {
		const tweets = [data.tweet1]
		assert.throws(function (){
			manipulator.manipulateTweets(data.manipulations, tweets, null)
		})
	});
	it("Participant is the tweet's author", () => {
		const tweets = [data.tweet1]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "premierleague")
		assert.equal(result.length, 1)
	});
	it("Participant is mentioned", () => {
		const tweets = [data.tweetWithLfcMentioned]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "LFC")
		assert.equal(result.length, 1)
	});
	it("One of the users in the manipulation wrote this tweet", () => {
		const tweets = [data.tweet1]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "someone")
		assert.equal(result.length, 0)
	});
	it("One of the hashtags in tweet is in the keywords", () => {
		const tweets = [data.tweet1]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "someone")
		assert.equal(result.length, 0)
	});
	it("The tweet's text contains a keyword", () => {
		const tweets = [data.tweet1]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "someone")
		assert.equal(result.length, 0)
	});
	it("The tweet is a retweet and one of the users in the manipulation wrote the original tweet", () => {
		const tweets = [data.retweet]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "someone")
		assert.equal(result.length, 0)
	});
	it("The tweet is a retweet and the participant is retweeted", () => {
		const tweets = [data.retweet]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "LFC")
		assert.equal(result.length, 1)
	});
	it("The tweet is a retweet and one of the hashtags in the original tweet is in the keywords", () => {
		const tweets = [data.retweet]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "someone")
		assert.equal(result.length, 0)
	});
	it("The tweet is a qoute and the participant is the quoted author", () => {
		const tweets = [data.quote]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "CAPEUSA")
		assert.equal(result.length, 1)
	});
	it("The tweet is a quote and one of the users in the manipulation wrote the quoted tweet", () => {
		const tweets = [data.quote]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "someone")
		assert.equal(result.length, 0)
	});
	it("The tweet is a quote and one of the hashtags in the quoted tweet is in the keywords", () => {
		const tweets = [data.quote]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "someone")
		assert.equal(result.length, 0)
	});
	it("The tweet is a quote and the quoted tweet's text contains one of the keywords", () => {
		const tweets = [data.quote]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "someone")
		assert.equal(result.length, 0)
	});
	it("The tweet is not matched to manipulation", () => {
		const tweets = [data.innocentTweet]
		const result = manipulator.manipulateTweets(data.manipulations, tweets, "someone")
		assert.equal(result.length, 1)
	});
});