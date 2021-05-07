// Requiring module
const assert = require('assert');
var experimentsCollection = require("../business_logic/db/mongodb/experimentsCollection.js")
var participantsCollection = require("../business_logic/db/mongodb/participantsCollection.js")
var researchersCollection = require("../business_logic/db/mongodb/researchersCollection.js")
var researchersCollection = require("../business_logic/db/mongodb/researchersCollection.js")
var manipulator = require("../business_logic/participant/manipulator/manipulator")


describe("Participant Collection tests", () => {


	it("Insert null participant", async () => {
		const result = await participantsCollection.insertParticipant(null);
		assert.strictEqual(result, false);
	});
	it("Insert legitamate participant", async () => {
		const result = await participantsCollection.insertParticipant({ "participant_twitter_id_str": "1234567", "user_twitter_token": "1234567" });
		assert.strictEqual(result, true);
	});
	it("Try to get a participant with invalid twitter  id", async () => {
		const result = await participantsCollection.getParticipantByTwitterId("123456789false");
		assert.strictEqual(result, false);

	});
	it("Try to get a participant with valid twitter  id", async () => {
		const result = await participantsCollection.getParticipantByTwitterId("1284058939982786560");
		assert.strictEqual(result, true);

	});
	it("Successfully updating twitter token", async () => {
		try {
			await participantsCollection.updateParticipantTokens("1284058939982786560", "12345678", "12345678");
			assert.strictEqual(true, true);

		}
		catch {
			assert.strictEqual(false, true);
		}

	});
	it("Successfully deleting user from experiment", async () => {
		try {
			await participantsCollection.deleteParticipantsFromExp("6f29d61e-b00b-4c64-ae78-77cfeeae4ae1");
			assert.strictEqual(true, true);

		}
		catch {
			assert.strictEqual(false, true);
		}

	});
	it("Successfully updating twitter token", async () => {
		try {
			await participantsCollection.getParticipantByToken("1238476547444572162-bUUfeVWudMt6oKbR7VLIaJxsZCFJuI");
			assert.strictEqual(true, true);

		}
		catch {
			assert.strictEqual(false, true);
		}

	});
	it("Successfully deleting user from experiment", async () => {
		try {
			await participantsCollection.getParticipantByToken("12345689false");
			assert.strictEqual(true, true);

		}
		catch {
			assert.strictEqual(false, true);
		}

	});
});
describe("Researchers Collection tests", () => {
	it("Successfully added an experiment id to researcher", async () => {
		try {
			await researchersCollection.addExperimentId("111857815327529621665", "12345678");
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully trying of adding an experiment id to invalid researcher", async () => {
		try {
			await researchersCollection.addExperimentId("123456789false", "12345678");
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully getting a researcher from the DB", async () => {
		try {
			await researchersCollection.getResearcher("111857815327529621665");
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully getting an invalid researcher from DB", async () => {
		try {
			await researchersCollection.getResearcher("123456789false");
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully getting a researcher from the DB", async () => {
		try {
			await researchersCollection.getResearcher("114204654536001599347");
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully trying to get a researcher with invalid id", async () => {
		try {
			await researchersCollection.getResearcher("12345678false");
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully getting a researcher from the DB", async () => {
		try {
			await researchersCollection.addResearcher({ researcher_id: "1234567890" });
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully adding a researcher to the DB", async () => {
		try {
			await researchersCollection.addResearcher(null);
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully getting a researcher's experiments from the DB", async () => {
		try {
			await researchersCollection.getResearcherExperiments("111857815327529621665");
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully getting a researcher's experiments from the DB", async () => {
		try {
			await researchersCollection.getResearcherExperiments(null);
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
});
describe("Experiment Collection tests", () => {
	it("Successfully insert an experiment to DB", async () => {
		try {
			await experimentsCollection.insertExperiment({ "exp_id": "3d855868-67bf-433d-915e-c671030ea455" });
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully trying to add a null experiment to DB", async () => {
		try {
			await experimentsCollection.insertExperiment(null);
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully getting an experiments from the DB", async () => {
		try {
			await experimentsCollection.getExperimentsByIds(["3d855868-67bf-433d-915e-c671030ea455", "2703f0a4-8413-4ce4-99d0-2643b9969b0a"]);
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully getting an experiment from the DB", async () => {
		try {
			await experimentsCollection.getExperimentById("3d855868-67bf-433d-915e-c671030ea455");
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully trying to get a null experiment from DB", async () => {
		try {
			await experimentsCollection.getExperimentById(null);
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully adding a researcher to the DB", async () => {
		try {
			await experimentsCollection.insertParticipantToExp("3d855868-67bf-433d-915e-c671030ea455", {
				"participant_twitter_username": "FrimTal",
				"participant_twitter_id_str": "1284058939982786560"
			});
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully trying to add participant to expriment with invalid id", async () => {
		try {
			await experimentsCollection.insertParticipantToExp("123456789false", {
				"participant_twitter_username": "FrimTal",
				"participant_twitter_id_str": "1284058939982786560"
			});
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully updating experiment status", async () => {
		try {
			await experimentsCollection.updateExpStatus("3d855868-67bf-433d-915e-c671030ea455", "active");
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully trying to update an invalid experiment status", async () => {
		try {
			experimentsCollection.updateExpStatus("3d855868-67bf-433d-915e-123456789false", "active");
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("successfully getting experiment by code", async () => {
		try {
			await experimentsCollection.getExperimentByCode("3d855868-67bf-433d-915e-c671030ea455");
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully trying to update an invalid experiment status", async () => {
		try {
			await experimentsCollection.getExperimentByCode("123456789false");
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
});
describe("Manipulator tests", () => {
	it("", async () => {
		try {
			const result = await manipulator.manipulateTweets([{
				"type": "mute",
				"users": ["realDonaldTrump", "dekellevy93", "techInsider"],
				"keywords": ["banana", "politic", "football"]
			}], [], parUserId);
			assert.strictEqual(result, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
});




// describe("Test2", () => {
// 	beforeEach(() => {
// 	console.log( "executes before every test" );
// 	});

// 	it("Is returning 4 when adding 2 + 3", () => {
// 	assert.equal(2 + 3, 4);
// 	});

// 	it("Is returning 8 when multiplying 2 * 4", () => {
// 	assert.equal(2*4, 8);
// 	});
// });
// });
