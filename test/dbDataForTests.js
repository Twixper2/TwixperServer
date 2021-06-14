const participant1 = {
    "exp_id": "102",
	"group_id": 11,
	"participant_twitter_id_str": "333",
	"participant_twitter_username": "yossi",
	"participant_twitter_name": "Yossi",
	"participant_twitter_friends_count": 84,
	"participant_twitter_followers_count": 11,
	"participant_twitter_profile_image": "https://pbs.twimg.com/profile_images/1327926340046229505/-XM4INec_normal.jpg",
	"participant_email": "gmail@gmail.com",
	"user_twitter_token": "555",
	"user_twitter_token_secret": "666",
	"group_manipulations": [{
		"type": "mute",
		"users": ["ManUtd", "YNB", "CoopSport", "NoamPrinz"],
		"keywords": ["soccer"]
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

const participant2 = {
    "exp_id": "100",
	"group_id": 11,
	"participant_twitter_id_str": "111",
	"participant_twitter_username": "ishlach_koren",
	"participant_twitter_name": "Koren Ishlach",
	"participant_twitter_friends_count": 84,
	"participant_twitter_followers_count": 11,
	"participant_twitter_profile_image": "https://pbs.twimg.com/profile_images/1327926340046229505/-XM4INec_normal.jpg",
	"participant_email": "gmail@gmail.com",
	"user_twitter_token": "222",
	"user_twitter_token_secret": "333",
	"group_manipulations": [{
		"type": "mute",
		"users": ["ManUtd", "YNB", "CoopSport", "NoamPrinz"],
		"keywords": ["soccer"]
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

const participant3 = {
    "exp_id": "103",
	"group_id": 11,
	"participant_twitter_id_str": "555",
	"participant_twitter_username": "nir",
	"participant_twitter_name": "Nir",
	"participant_twitter_friends_count": 84,
	"participant_twitter_followers_count": 11,
	"participant_twitter_profile_image": "https://pbs.twimg.com/profile_images/1327926340046229505/-XM4INec_normal.jpg",
	"participant_email": "gmail@gmail.com",
	"user_twitter_token": "900",
	"user_twitter_token_secret": "901",
	"group_manipulations": [{
		"type": "mute",
		"users": ["ManUtd", "YNB", "CoopSport", "NoamPrinz"],
		"keywords": ["soccer"]
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

const participantToRemove = {
    "exp_id": "101",
	"group_id": 11,
	"participant_twitter_id_str": "112",
	"participant_twitter_username": "avi",
	"participant_twitter_name": "Avi",
	"participant_twitter_friends_count": 84,
	"participant_twitter_followers_count": 11,
	"participant_twitter_profile_image": "https://pbs.twimg.com/profile_images/1327926340046229505/-XM4INec_normal.jpg",
	"participant_email": "gmail@gmail.com",
	"user_twitter_token": "223",
	"user_twitter_token_secret": "334",
	"group_manipulations": [{
		"type": "mute",
		"users": ["ManUtd", "YNB", "CoopSport", "NoamPrinz"],
		"keywords": ["soccer"]
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

const researcher1 = {
    "researcher_id": "1111",
    "researcher_username": "twixper app",
    "researcher_email": "gmail@gmail.com",
    "experiments_ids": ["222", "333"]
}

const researcher2 = {
    "researcher_id": "2222",
    "researcher_username": "nir res",
    "researcher_email": "gmail@gmail.com",
    "experiments_ids": ["555"]
}

const exp1 = {
	"exp_id": "1111",
	"exp_code": "aaa",
    "title": "test exp 011",
    "description": "test desc",
    "researcher_details": {
        "researcher_id": "100661359885301662673",
        "researcher_username": "Tal Frimerman",
        "researcher_email": "talf123123@gmail.com"
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
        "group_num_of_participants": 0,
        "group_participants": []
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
    "status": "active",
    "start_date": "05/11/2021 18:46:18 UTC",
    "num_of_participants": 0,
}

const exp2 = {
	"exp_id": "2222",
	"exp_code": "bbb",
    "title": "test exp 011",
    "description": "test desc",
    "researcher_details": {
        "researcher_id": "100661359885301662673",
        "researcher_username": "Tal Frimerman",
        "researcher_email": "talf123123@gmail.com"
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
        "group_num_of_participants": 0,
        "group_participants": []
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
    "status": "active",
    "start_date": "05/11/2021 18:46:18 UTC",
    "num_of_participants": 0,
}

const exp3 = {
	"exp_id": "3333",
	"exp_code": "ccc",
    "title": "test exp 011",
    "description": "test desc",
    "researcher_details": {
        "researcher_id": "100661359885301662673",
        "researcher_username": "Tal Frimerman",
        "researcher_email": "talf123123@gmail.com"
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
        "group_num_of_participants": 0,
        "group_participants": []
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
    "status": "active",
    "start_date": "05/11/2021 18:46:18 UTC",
    "num_of_participants": 0,
}

const expParticipant1 = {
	"participant_twitter_username": "FrimTal",
	"participant_twitter_id_str": "1284058939982786560"
}

const expToActivate1 = {
    "title": "removing some tweets",
    "description": "Wow",
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
    }],
}

const invalidExpToActivate1 = {
    "title": "removing some tweets",
    "description": "Wow",
    "exp_groups": [],
}

const invalidExpToActivate2 = {
    "title": "removing some tweets",
    "description": "Wow",
    "exp_groups": [{
        "group_name": "Control group",
        "group_size_in_percentage": 100,
        // "group_manipulations": null,
    }],
}

const invalidExpToActivate3 = {
    "title": "removing some tweets",
    "description": "Wow",
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
            "type": "null",
            "users": [],
            "keywords": []
        }],
    }],
}

module.exports = {
    participant1, participant2, participant3, participantToRemove,
    researcher1, researcher2,
	exp1, exp2, exp3, expParticipant1,
    expToActivate1, invalidExpToActivate1, invalidExpToActivate2, invalidExpToActivate3
}
