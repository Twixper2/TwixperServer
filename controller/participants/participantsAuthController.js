var express = require("express");
var router = express.Router();
const database = require("../../business_logic/db/DBCommunicator.js");
const participantsService = require("../../service/participants/participantsService.js");
const bcrypt = require("bcryptjs");

/**
 * Requesting the oauth tokens from twitter, by the oauth_callback param
 */
router.post("/twitterAuthRequestToken", async (req, res, next) => {
	const params = req.body;
	if (!params || !params.oauth_callback) {
		res.status(400).send("No params suplied.");
		return;
	}
	try {
		const oauthTokens = await participantsService.getTwitterRequestToken(params.oauth_callback);
		res.send(oauthTokens);
	} catch (e) {
		console.log(e);
		if (e.message) {
			// error thrown from the api
			res.status(502).json(e);
		} else {
			// Internal error
			res.sendStatus(500);
		}
	}
});

/**
 * Requesting the access token from twitter
 */
router.post("/twitterAuthAccessToken", async (req, res, next) => {
	const params = req.body;
	if (!params || !params.oauth_token || !params.oauth_verifier) {
		res.status(400).send("No params suplied.");
		return;
	}
	try {
		const oauthTokens = await participantsService.getTwitterAccesssToken(params.oauth_token, params.oauth_verifier);
		res.send(oauthTokens);
	} catch (e) {
		console.log(e);
		if (e.message) {
			// error thrown from the api
			res.status(502).json(e);
		} else {
			// Internal error
			res.sendStatus(500);
		}
	}
});

/**
 * Check if participant has a valid session in db (the participant with the same token exists)
 */
router.post("/participantValidateSession", async (req, res, next) => {
	// if (req.session && req.session.userTwitterToken) {
	if (req.header("User-Twitter-Token") && req.header("User-Twitter-Token-Secret")) {
		// const token = req.session.userTwitterToken;
		const token = req.header("User-Twitter-Token");
		try {
			const participant = await database.getParticipantByToken(token);
			if (participant) {
				const participant_twitter_info = participantsService.extractTwitterInfoFromParticipantObj(participant);
				res.json({ hasSession: true, participant_twitter_info: participant_twitter_info });
				return;
			} else {
				res.json({ hasSession: false });
				return;
			}
		} catch (e) {
			console.log(e);
			res.sendStatus(500);
		}
	} else {
		res.json({ hasSession: false });
	}
});

/**
 * Gets oauth token and oauth token secret, returns two fields:
 * twitter_user_found - is this a real valid twitter user?
 * user_registered_to_experiment - is the user already registered to experiment?
 * In case of real twitter user, we responde with the tokens in the header for the client to put them in the headers of it's requests
 * (cookie-like implementation)
 */
// if { twitter_user_found : true, user_registered_to_experiment : true }  give cookie with CURRENT tokens (if needed kill old cookies and give new)
// if { twitter_user_found : true, user_registered_to_experiment : false } give cookies (regular new user registration)
// if { twitter_user_found : false } do nothing, respond code 400
router.post("/checkUserByCredentials", async (req, res, next) => {
	try {
		const oauthToken = req.body.oauth_token;
		const oauthTokenSecret = req.body.oauth_token_secret;
		if (!oauthToken || !oauthTokenSecret) {
			res.status(400).send("Not all params from oauth supllied.");
			return;
		}

		const twitterUser = await participantsService.getTwitterUserFromTokens(oauthToken, oauthTokenSecret);
		const twitter_id_str = twitterUser.id_str;

		// no such user in twitter
		if (!twitter_id_str) {
			res.status(400).json({
				twitter_user_found: false,
				user_registered_to_experiment: false,
			});
			return;
		}

		/*
    // deleting old cookies if they are differnt
    if ((req.session &&  req.session.userTwitterToken && req.session.userTwitterToken!=oauthToken)
      || (req.session &&  req.session.userTwitterTokenSecret && req.session.userTwitterTokenSecret!=oauthTokenSecret)) {
        req.session.reset();
    }

    // giving user cookies if there aren't 
    if (!req.session.userTwitterToken) {
      req.session.userTwitterToken = oauthToken;
    }
    if (!req.session.userTwitterTokenSecret) {
      req.session.userTwitterTokenSecret = oauthTokenSecret;
    }
    */

		// Setting headers
		res.set({
			"User-Twitter-Token": oauthToken,
			"User-Twitter-Token-Secret": oauthTokenSecret,
		});

		// checking if user already registered to an experiment
		let participant = await database.getParticipantByTwitterId(twitter_id_str);
		// participant already registered to an experiment
		if (participant) {
			let oauthTokenSecretEnc = encryptToken(oauthTokenSecret); // we encrypt the token secret
			await database.updateParticipantTokens(twitter_id_str, oauthToken, oauthTokenSecretEnc);
			const participant_twitter_info = participantsService.extractTwitterInfoFromParticipantObj(participant);
			res.status(200).json({
				twitter_user_found: true,
				user_registered_to_experiment: true,
				participant_twitter_info: participant_twitter_info,
			});
		}
		// user is not registered to experiment already
		else {
			res.status(200).json({
				twitter_user_found: true,
				user_registered_to_experiment: false,
			});
		}
	} catch (e) {
		// end try
		console.log(e);
		res.sendStatus(500);
	}
});

router.post("/registerToExperiment", async (req, res, next) => {
	try {
		// validate request params and cookies
		const expCode = req.body.exp_code;
		if (!expCode) {
			res.status(400).send("No experiment code provided.");
			return;
		}

		if (!req.header("User-Twitter-Token") || !req.header("User-Twitter-Token-Secret")) {
			res.status(428).send("Missing auth headers (User-Twitter-Token, User-Twitter-Token-Secret)");
			return;
			/*
        The HTTP 428 Precondition Required response status code indicates that the server requires
        the request to be conditional. Typically, this means that a required precondition header, 
        such as If-Match , is missing.
      */
		}
		/*if (!req.session || !req.session.userTwitterToken || !req.session.userTwitterTokenSecret) {
      res.status(401).send("Login with twitter first.");
      return;
    }*/

		// const oauthToken = req.session.userTwitterToken
		// const oauthTokenSecret = req.session.userTwitterTokenSecret

		// TODO: Decrypt tokens
		const oauthToken = req.header("User-Twitter-Token");
		const oauthTokenSecret = req.header("User-Twitter-Token-Secret");

		// trying registering user
		let participant = null;
		try {
			participant = await participantsService.registerParticipant(oauthToken, oauthTokenSecret, expCode);
		} catch (e) {
			// if it is an error with message, we respond with the eror object containing "name" and "message" keys
			console.log(e);
			if (e.message) {
				res.status(400).json(e);
				return;
			}
			throw e;
		}
		if (!participant) {
			//registration failed
			res.sendStatus(500);
			return;
		}
		const participant_twitter_info = participantsService.extractTwitterInfoFromParticipantObj(participant);
		res.status(200).json({ participant_twitter_info: participant_twitter_info }); //success
	} catch (e) {
		// end try
		console.log(e);
		res.sendStatus(500);
	}
});

function encryptToken(token) {
	return bcrypt.hashSync(token, 10);
}

module.exports = router;
