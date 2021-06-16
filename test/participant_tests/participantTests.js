// Requiring modules
var participantAuthUtils = require("../../business_logic/participant/participant_auth_utils/participantAuthUtils");
var common = require("../common");
var assert = common.assert;
const oauthToken = "1317154410766782464-mfqTTNRVSgkpFZpdY3yGQQkkDliggX"
const oauthTokenSecret = "AZoMd0chna3QZbVpFDJkUgNsacwiAubrfDNB1vVLHzsvd"

describe("Participant tests", () => {

    describe("Participant registration tests",  () => {

        it("Null token", async () => {
            try{
                let result = await participantAuthUtils.registerParticipant(null, oauthTokenSecret, "bbb")
                assert.fail("Should return error")
            }
            catch(e){
                assert.strictEqual(e.name, "InvalidArguments")
            }
        });

        it("Null token secret", async () => {
            try{
                let result = await participantAuthUtils.registerParticipant(oauthToken, null, "bbb")
                assert.fail("Should return error")
            }
            catch(e){
                assert.strictEqual(e.name, "InvalidArguments")
            }
        });

        it("Null experiment code", async () => {
            try{
                let result = await participantAuthUtils.registerParticipant(oauthToken, oauthTokenSecret, null)
                assert.fail("Should return error")
            }
            catch(e){
                assert.strictEqual(e.name, "InvalidArguments")
            }
        });

        it("Invalid experiment code", async () => {
            try{
                let result = await participantAuthUtils.registerParticipant(oauthToken, oauthTokenSecret, "invaliddd")
                assert.fail("Should return invalid exp error")
            }
            catch(e){
                assert.strictEqual(e.name, "NoSuchExperiment")
            }
        });

        it("Successful participant registration", async () => {
            try{
                let result = await participantAuthUtils.registerParticipant(oauthToken, oauthTokenSecret, "bbb")
                assert.isNotNull(result, "Should return participant object")
            }
            catch(e){
                assert.fail(JSON.stringify(e))
            }
        });
    })

});