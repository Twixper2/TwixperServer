// Requiring modules
var manipulator = require("../../business_logic/participant/manipulator/manipulator")
var testData = require("./dataForManipulatorTests")
var common = require("../common");
var assert = common.assert;

describe("Manipulator tests", () => {
	it("manip test", () => {
        console.log(testData.tweet1)
        console.log(testData.tweet2)
		assert.strictEqual(true, true)
	});
});