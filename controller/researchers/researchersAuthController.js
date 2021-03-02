var express = require("express");
var router = express.Router();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

/**
 * Verify the id_token, check if the researcher already in database. If so, give him cookie.
 * If not, create new researcher and give him cookie
 */
router.post("/researcherGoogleLogin", async (req, res, next) => {
    const id_token = req.body.id_token
    if (!id_token) {
        res.sendStatus(400)
    }
    try {
        
        //verify real google user
        const researcherId = await verifyGoogleUser(id_token) //store this id as key in user record
        if (!researcherId) {
            res.sendStatus(401); // not a google user
        }

        // checking if already registered, if yes, give cookie and thats it
        let researcher = await researcherService.getResearcher(id_token)
        if (researcher) {
            req.session.id_token = id_token
            res.sendStatus(200)
            return
        }

        // new user, register him and give cookie
        let addedResearcher = await researcherService.registerResearcher(researcherId)
        if (addedResearcher) {
            req.session.id_token = id_token
            res.sendStatus(200)
            return
        }
        else {
            res.sendStatus(500);
        }
    }
    catch (e) { //network failed somewhere
        res.sendStatus(500)
    }
});



async function verifyGoogleUser(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID_RESEARCHER_WEB,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload['sub']; //this is the key we will be using to identify the researcher
    return userid
}

module.exports = router;
