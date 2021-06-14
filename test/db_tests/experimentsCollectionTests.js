// Requiring modules
var experimentsCollection = require("../../business_logic/db/mongodb/experimentsCollection.js")
var common = require("../common");
const data = require("../dbDataForTests")
var assert = common.assert;
var expect = common.expect;

describe("Experiments Collection tests", () => {

	it("Successfully insert an experiment to DB", async () => {
		try {
			const result = await experimentsCollection.insertExperiment(data.exp3);
			assert.strictEqual(result, true);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Unsuccessfully trying to add a null experiment to DB", async () => {
		await expect(experimentsCollection.insertExperiment(null)).to.eventually.be.rejected
	});
	it("Successfully getting an experiments from the DB", async () => {
		try {
			const result = await experimentsCollection.getExperimentsByIds(["1111", "2222"]);
			assert.strictEqual(2, result.length);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Successfully getting an experiment from the DB", async () => {
		try {
			const result = await experimentsCollection.getExperimentById("1111");
			const realId = data.exp1.exp_id
			assert.strictEqual(result.exp_id, realId);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Unsuccessfully trying to get a null experiment from DB", async () => {
		try {
			const result = await experimentsCollection.getExperimentById(null);
			assert.strictEqual(result, null);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Successfully adding a participant to an experiment", async () => {
		try {
			const result = await experimentsCollection.insertParticipantToExp("1111", data.expParticipant1);
			assert.strictEqual(result, true);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Unsuccessfully trying to add participant to expriment with invalid id", async () => {
		try {
			const result = await experimentsCollection.insertParticipantToExp("123456789false", data.expParticipant1);
			assert.strictEqual(result, false);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Successfully updating experiment status", async () => {
		try {
			const result = await experimentsCollection.updateExpStatus("1111", "close");
			assert.strictEqual(result, true);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Unsuccessfully trying to update an invalid experiment status", async () => {
		try {
			const result = await experimentsCollection.updateExpStatus("123456789false", "close");
			assert.strictEqual(result, false);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("successfully getting experiment by code", async () => {
		try {
			const result = await experimentsCollection.getExperimentByCode("aaa");
			const realId = data.exp1.exp_id
			assert.strictEqual(result.exp_id, realId);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Unsuccessfully trying to update an invalid experiment status", async () => {
		try {
			const result = await experimentsCollection.getExperimentByCode("123456789false");
			assert.strictEqual(result, null);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	
});