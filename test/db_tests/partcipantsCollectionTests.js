// Requiring modules
var participantsCollection = require("../../business_logic/db/mongodb/participantsCollection.js")
const data = require("../dbDataForTests")
var common = require("../common");
var assert = common.assert;
var expect = common.expect;

describe("Participants Collection tests", () => {

	it("Insert null participant", async () => {
		await expect(participantsCollection.insertParticipant(null)).to.eventually.be.rejected
	});
	it("Insert legitamate participant", async () => {
		const result = await participantsCollection.insertParticipant(data.participant3);
		assert.strictEqual(result, true);
	});
	it("Try to get a participant with invalid twitter  id", async () => {
		const result = await participantsCollection.getParticipantByTwitterId("123456789false");
		assert.strictEqual(result, null);
	});
	it("Try to get a participant with valid twitter id", async () => {
		const result = await participantsCollection.getParticipantByTwitterId("333");
		const realName = data.participant1.participant_twitter_name
		const resultName = result.participant_twitter_name
		assert.strictEqual(realName, resultName);
	});
	it("Successfully updating twitter token", async () => {
		try {
			const result = await participantsCollection.updateParticipantTokens("333", "12345678", "123456789");
			assert.strictEqual(result, true);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Successfully deleting participants from experiment", async () => {
		try {
			const exp_id = data.participantToRemove.exp_id
			const result = await participantsCollection.deleteParticipantsFromExp(exp_id);
			assert.strictEqual(result, true);
		}
		catch(e) {
			assert.fail(e)
		}

	});
	it("Successfully getting participant by twitter token", async () => {
		try {
			const result = await participantsCollection.getParticipantByToken("222");
			const realName = data.participant2.participant_twitter_name
			const resultName = result.participant_twitter_name
			assert.strictEqual(realName, resultName);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	
	
});