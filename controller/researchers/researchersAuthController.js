var express = require("express");
var router = express.Router();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

/**
 * Verify the id_token, check if the researcher already in database. If so, give him cookie.
 * If not, create new researcher and give him cookie
 */
router.post("/researcherGoogleLogin", async (req, res, next) => {
    let id_token = req.body.id_token
    if (!id_token) {
        res.sendStatus(400)
    }
    try {
        const researcherId = await verifyGoogleUser(id_token) //store this id as key in user record
        if (!researcherId) {
            res.sendStatus(401); // not a google user
        }
        let addedResearcher = await researcherService.registerResearcher(researcherId)
        if (addedResearcher) {
            res.sendStatus(200)
        }
        else {
            res.sendStatus(500);
        }
    }
    catch (e) { //network failed
        res.sendStatus(500)
    }
});



async function verifyGoogleUser(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return userid
}

module.exports = router;
