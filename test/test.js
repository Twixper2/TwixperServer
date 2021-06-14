const data = require("./dbDataForTests")
var makeDb = require("../business_logic/db/mongodb/DBConnector").makeDb

describe("Tests", () => {
	before(async function () { // beforeAll
		this.timeout(10000);
        console.log("Inserting data to 'Twixper-Test' database before all tests");
        const db = await makeDb()
        let participantsCollection = db.collection("Participants")
        let researchersCollection = db.collection("Researchers")
        let experimentsCollection = db.collection("Experiments")
        await Promise.all([
            participantsCollection.insertOne(data.participant1),
            participantsCollection.insertOne(data.participant2),
            participantsCollection.insertOne(data.participantToRemove),
            researchersCollection.insertOne(data.researcher1),
            experimentsCollection.insertOne(data.exp1),
            experimentsCollection.insertOne(data.exp2),
        ])
    });
	require("./db_tests/dbTests")
	require("./researcher_tests/researcherTests")
	require("./participant_tests/participantTests")
	require("./manipulator_tests/manipulatorTests")
	after(async function () { // afterAll
		this.timeout(10000);
        console.log("Clearing data from 'Twixper-Test' database after all tests");
        const db = await makeDb()
        let participantsCollection = db.collection("Participants")
        let researchersCollection = db.collection("Researchers")
        let experimentsCollection = db.collection("Experiments")
        await Promise.all([
            participantsCollection.deleteMany( { } ),
            researchersCollection.deleteMany( { } ),
            experimentsCollection.deleteMany( { } ),
        ])
    });
})
// Requiring modules

/*
var experimentsCollection = require("../business_logic/db/mongodb/experimentsCollection.js")
var participantsCollection = require("../business_logic/db/mongodb/participantsCollection.js")
var researchersCollection = require("../business_logic/db/mongodb/researchersCollection.js")
var researcherExperiments = require('../business_logic/researchers/experiments/researcherExperiments.js')
var participantFeed = require("../business_logic/participant/participant_manipulated_data/participantFeed.js");
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
	it("Unsuccessfully adding a null researcher to the DB", async () => {
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
			}], [tweet].user.screen_name, parUserName);
			result.contain(tweet.idstr)
			assert.strictEqual(result, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
});

describe("Participant feed tests", () => {
	it("Successfully getting a participant feed", async () => {
		try {
			await participantFeed.getFeed({ participant_twitter_username: "ishlach_koren", participant_twitter_id_str: "1238476547444572162" });
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully getting a participant feed - participant is null", async () => {
		try {
			await participantFeed.getFeed(null);
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
});
describe("Researcher experiments tests", () => {
	it("Successfully activiate a researcher experiment", async () => {
		try {
			await researcherExperiments.activateNewExperiment("title": "removing some tweets",
				"description": "Wow",
				"researcher_details": {
				"researcher_id": "100661359885301662673"
			},
				"exp_groups": [{
					"group_name": "Control group",
					"group_size_in_percentage": 100,
					"group_manipulations": [{
						"type": "mute",
						"users": [],
						"keywords": []
					}, {
						"type": "inject",
						"users": [],
						"keywords": []
					}, {
						"type": "pixel_media",
						"users": [],
						"keywords": []
					}, {
						"type": "remove_media",
						"users": [],
						"keywords": []
					}],
					"group_id": 11,
					"group_num_of_participants": 1,
					"group_participants": [{
						"participant_twitter_username": "FrimTal",
						"participant_twitter_id_str": "1284058939982786560"
					}]
				}],
				"status": "active",
				"start_date": "04/02/2021 18:55:13",
				"num_of_participants": 1,
				"exp_id": "2703f0a4-8413-4ce4-99d0-2643b9969b0a",
				"exp_code": "b41cef", "researcher_id": "100661359885301662673",
				"researcher_username": "Tal Frimerman",
				"researcher_email": "talf123123@gmail.com");
			assert.strictEqual(true, true);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully activiate a null experiment to researcher", async () => {
		try {
			await researcherExperiments.activateNewExperiment(null, {
				"researcher_id": "100661359885301662673",
				"researcher_username": "Tal Frimerman",
				"researcher_email": "talf123123@gmail.com"
			});
			assert.strictEqual(false, false);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully getting a researcher experiment", async () => {
		try {
			await researcherExperiments.getExperiments(["fe731ba4-98b6-426d-b2dc-6ccf81d36c20"]);
			if (experiments && experiments != [])
				assert.strictEqual(true, true);
				else {
					assert.strictEqual(false, true);
				}
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully getting a researcher experiment", async () => {
		try {
			const experiments = await researcherExperiments.getExperiments([]);
			if (experiments && experiments != []) {
				assert.strictEqual(false, false);
			}
			else {
				assert.strictEqual(false, true);
			}
		}

		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Successfully ending a valid id experiment", async () => {
		try {
			if (experiments && experiments != [])
				assert.strictEqual(await researcherExperiments.endExperiment(["fe731ba4-98b6-426d-b2dc-6ccf81d36c20"]), true
				);
		}
		catch {
			assert.strictEqual(false, true);
		}
		assert.strictEqual(false, true);

	});
	it("Unsuccessfully ending an invalid id experiment", async () => {
		try {
			assert.strictEqual(await researcherExperiments.endExperiment(["1234567890false"]), false
			);
		}
		catch {
			assert.strictEqual(false, true);
		}
		assert.strictEqual(false, true);

	});
	it("Successfully validate experiment's fields", async () => {
		try {
			if (experiments && experiments != [])
				assert.strictEqual(await researcherExperiments.validateExpFields({
					"title": "Test end exp",
					"description": "asda",
					"researcher_details": {
						"researcher_id": "103134605356512612125",
						"researcher_username": "twixper app",
						"researcher_email": "twixper@gmail.com"
					},
					"exp_groups": [{
						"group_name": "Control group",
						"group_size_in_percentage": 50,
						"group_manipulations": [{
							"type": "mute",
							"users": [],
							"keywords": []
						}, {
							"type": "inject",
							"users": [],
							"keywords": []
						}, {
							"type": "pixel_media",
							"users": [],
							"keywords": []
						}, {
							"type": "remove_media",
							"users": [],
							"keywords": []
						}],
						"group_id": 11,
						"group_num_of_participants": 1,
						"group_participants": [{
							"participant_twitter_username": "TwixperApp",
							"participant_twitter_id_str": "1316847294424199168"
						}]
					}, {
						"group_name": "Group 2",
						"group_size_in_percentage": 50,
						"group_manipulations": [{
							"type": "mute",
							"users": [],
							"keywords": []
						}, {
							"type": "inject",
							"users": [],
							"keywords": []
						}, {
							"type": "pixel_media",
							"users": [],
							"keywords": []
						}, {
							"type": "remove_media",
							"users": [],
							"keywords": []
						}],
						"group_id": 12,
						"group_num_of_participants": 0,
						"group_participants": []
					}],
					"status": "closed",
					"start_date": "04/18/2021 13:46:21 UTC",
					"num_of_participants": 1,
					"exp_id": "fe731ba4-98b6-426d-b2dc-6ccf81d36c20",
					"exp_code": "c46357",
					"end_date": "04/18/2021 13:53:48 UTC"
				}), true
				);
		}
		catch {
			assert.strictEqual(false, true);
		}
		assert.strictEqual(false, true);

	});
	it("Unsuccessfully trying to validate an experiment with 0 groups", async () => {
		try {
			assert.strictEqual(await researcherExperiments.validateExpFields(({
				"title": "Test end exp",
				"description": "asda",
				"researcher_details": {
					"researcher_id": "103134605356512612125",
					"researcher_username": "twixper app",
					"researcher_email": "twixper@gmail.com"
				},
				"exp_groups": [],
				"status": "closed",
				"start_date": "04/18/2021 13:46:21 UTC",
				"num_of_participants": 1,
				"exp_id": "fe731ba4-98b6-426d-b2dc-6ccf81d36c20",
				"exp_code": "c46357",
				"end_date": "04/18/2021 13:53:48 UTC"
			})), false
			);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully trying to validate an experiment with 0 manipulations in groups", async () => {
		try {
			assert.strictEqual(await researcherExperiments.validateExpFields(({
				"title": "Test end exp",
				"description": "asda",
				"researcher_details": {
					"researcher_id": "103134605356512612125",
					"researcher_username": "twixper app",
					"researcher_email": "twixper@gmail.com"
				},
				"exp_groups": [{
					"group_name": "Control group",
					"group_size_in_percentage": 50,
					"group_manipulations": null,
					"group_id": 11,
					"group_num_of_participants": 1,
					"group_participants": [{
						"participant_twitter_username": "TwixperApp",
						"participant_twitter_id_str": "1316847294424199168"
					}]
				}, {
					"group_name": "Group 2",
					"group_size_in_percentage": 50,
					"group_manipulations": null,
					"group_id": 12,
					"group_num_of_participants": 0,
					"group_participants": []
				}],
				"status": "closed",
				"start_date": "04/18/2021 13:46:21 UTC",
				"num_of_participants": 1,
				"exp_id": "fe731ba4-98b6-426d-b2dc-6ccf81d36c20",
				"exp_code": "c46357",
				"end_date": "04/18/2021 13:53:48 UTC"
			}), false
			));
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
	it("Unsuccessfully trying to validate an experiment which one of the manipulations type is null", async () => {
		try {
			assert.strictEqual(await researcherExperiments.validateExpFields({
				"title": "Test end exp",
				"description": "asda",
				"researcher_details": {
					"researcher_id": "103134605356512612125",
					"researcher_username": "twixper app",
					"researcher_email": "twixper@gmail.com"
				},
				"exp_groups": [{
					"group_name": "Control group",
					"group_size_in_percentage": 50,
					"group_manipulations": [{
						"type": "mute",
						"users": [],
						"keywords": []
					}, {
						"type": "inject",
						"users": [],
						"keywords": []
					}, {
						"type": "pixel_media",
						"users": [],
						"keywords": []
					}, {
						"type": null,
						"users": [],
						"keywords": []
					}],
					"group_id": 11,
					"group_num_of_participants": 1,
					"group_participants": [{
						"participant_twitter_username": "TwixperApp",
						"participant_twitter_id_str": "1316847294424199168"
					}]
				}, {
					"group_name": "Group 2",
					"group_size_in_percentage": 50,
					"group_manipulations": [{
						"type": "mute",
						"users": [],
						"keywords": []
					}, {
						"type": "inject",
						"users": [],
						"keywords": []
					}, {
						"type": "pixel_media",
						"users": [],
						"keywords": []
					}, {
						"type": "remove_media",
						"users": [],
						"keywords": []
					}],
					"group_id": 12,
					"group_num_of_participants": 0,
					"group_participants": []
				}],
				"status": "closed",
				"start_date": "04/18/2021 13:46:21 UTC",
				"num_of_participants": 1,
				"exp_id": "fe731ba4-98b6-426d-b2dc-6ccf81d36c20",
				"exp_code": "c46357",
				"end_date": "04/18/2021 13:53:48 UTC"
			}), true
			);
		}
		catch {
			assert.strictEqual(false, true);
		}
	});
});*/