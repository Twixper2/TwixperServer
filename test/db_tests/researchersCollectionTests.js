// Requiring modules
var researchersCollection = require("../../business_logic/db/mongodb/researchersCollection.js")
const data = require("../dbDataForTests")
var common = require("../common");
var assert = common.assert;
var expect = common.expect;

describe("Researchers Collection tests", () => {

	it("Successfully added an experiment id to researcher", async () => {
		try {
			const result = await researchersCollection.addExperimentId("1111", "444");
			assert.strictEqual(result, true);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Unsuccessfully trying of adding an experiment id to invalid researcher", async () => {
		try {
			const result = await researchersCollection.addExperimentId("123456789false", "12345678");
			assert.strictEqual(result, false);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Successfully getting a researcher from the DB", async () => {
		try {
			const result = await researchersCollection.getResearcher("1111");
			const resultName = result.researcher_username
			const realName = data.researcher1.researcher_username
			assert.strictEqual(resultName, realName);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Unsuccessfully getting an invalid researcher from DB", async () => {
		try {
			const result = await researchersCollection.getResearcher("123456789false");
			assert.strictEqual(result, null);
		}
		catch(e) {
			assert.fail(e)
		}
	});

	it("Successfully adding a researcher to the DB", async () => {
		try {
			let result = await researchersCollection.addResearcher(data.researcher2);
			assert.strictEqual(result, true);
		}
		catch(e) {
			assert.fail(e)
		}
	});
	it("Unsuccessfully adding a null researcher to the DB", async () => {
		await expect(researchersCollection.addResearcher(null)).to.eventually.be.rejected
	});
	
});