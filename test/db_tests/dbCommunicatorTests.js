var dbComm = require("../../business_logic/db/DBCommunicator")
const data = require("../dbDataForTests")
var common = require("../common");
var assert = common.assert;
var expect = common.expect;
var participant = {
    "exp_id": "1111",
    "group_id": 11,
    "participant_twitter_id_str": "131715441",
    "participant_twitter_username": "deefper_",
    "participant_twitter_name": "john doe",
    "participant_twitter_friends_count": 34,
    "participant_twitter_followers_count": 0,
    "participant_twitter_profile_image": "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
    "participant_email": "aaa@gmail.com",
    "user_twitter_token": "46",
    "user_twitter_token_secret": "45",
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
    }]
}

describe("DB Communicator tests", () => {

	it("Unsuccessfully insertion of a participant", async () => {
		await expect(dbComm.insertParticipant(null)).to.eventually.be.rejected
	});
	it("Successful insertion of a participant", async () => {
		try {
			const result = await dbComm.insertParticipant(participant);
			assert.strictEqual(result, true);
		}
		catch(e) {
			assert.fail(e)
		}
	});
});