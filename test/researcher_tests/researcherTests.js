// Requiring modules
var researcherExperiments = require('../../business_logic/researchers/experiments/researcherExperiments.js')
const data = require("../dbDataForTests")
var common = require("../common");
var assert = common.assert;
var expect = common.expect;

describe("Researcher tests", () => {
    describe("Researcher experiments tests", () => {
        it("Successfully activate a researcher experiment", async () => {
            try {
                const result = await researcherExperiments.activateNewExperiment(data.expToActivate1, data.researcher1);
                // Should return an exp code
                assert.typeOf(result, "string");
            }
            catch(e) {
                assert.fail(e)
            }
        }).timeout(10000);
        it("Unsuccessfully activate a null experiment", async () => {
            await expect(researcherExperiments.activateNewExperiment(null, data.researcher1)).to.eventually.be.rejected
        });
        it("Successfully ending a valid id experiment", async () => {
            try {
                const result = await researcherExperiments.endExperiment("1111")
                assert.strictEqual(result, true);
            }
            catch(e) {
                assert.fail(e)
            }
        });
        it("Unsuccessfully ending an invalid id experiment", async () => {
            try {
                const result = await researcherExperiments.endExperiment("1234567890false")
                assert.strictEqual(result, false);
            }
            catch(e) {
                assert.fail(e)
            }
        });
        it("Successfully validate experiment's fields", async () => {
            const result = researcherExperiments.validateExpFields(data.expToActivate1)
            assert.strictEqual(result, true);
        });
        it("Unsuccessfully trying to validate an experiment with 0 groups", async () => {
            const result = researcherExperiments.validateExpFields(data.invalidExpToActivate1)
            assert.strictEqual(result, false);
        });
        it("Unsuccessfully trying to validate an experiment with 0 manipulations in groups", async () => {
            const result = researcherExperiments.validateExpFields(data.invalidExpToActivate2)
            assert.strictEqual(result, false);
        });
        it("Unsuccessfully trying to validate an experiment which one of the manipulations type is null", async () => {
            const result = researcherExperiments.validateExpFields(data.invalidExpToActivate3)
            assert.strictEqual(result, false);
        });
    })
})