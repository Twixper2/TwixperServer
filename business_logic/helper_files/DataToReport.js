exports.researcher = {
    // Details we get from google sign in, such as email and maybe full name.
    // "email": "",
    // "full_name": "",
    "experiments_ids": [235989, 65983, 569895, 878452]
}

exports.groupManipulations = [
    // Every type and field is optional and can be missing.
    {
        "type": "mute",
        "users": ["realDonaldTrump", "dekellevy93", "techInsider"],
        "keywords": ["banana", "politic", "football"]
    },
    {
        "type": "inject",
        "users": ["idfonline", "Ayeley_Shaked", "grinbergnir"],
        "keywords": ["samsung", "bibi", "covid19"]
    },
    {
        "type": "pixel_media",
        "users": ["thisIsArt", "yairLapid"],
        "keywords": ["art", "violence"]
    },
    {
        "type": "remove_media",
        "users": ["YinonMagal"],
        "keywords": ["nature", "riot"]
    }
]

exports.experiment = {
    "exp_id": "",
    "exp_code": "", // Null if Draft
    "title": "",
    "description": "",
    "start_date": "", // Null if not started yet
    "end_date" : "", // Null if not ended yet
    "status": "", // Draft, Active, Closed
    "researcher_details": {
        // Details we get from google sign in, such as email and maybe full name.
    },
    "collabed_res": [
        //{"first_name": "", "last_name": "", "username": ""},
        // Ids 
    ],
    "num_of_participants": "",
    "exp_groups": [ // array of objects
        {
            "group_id": "", // Group id within the experiment. Groups in different experiments may have the same id.
            "group_name": "",
            "group_num_of_participants": "",
            "group_size_in_percentage": "", //גודל הקבוצה באחוזים כפי שהחוקר הגדיר בצור ניסוי
            "group_participants": [ // array of objects
                {"participant_twitter_username": "", "participant_twitter_id_str": ""}, // possibly more fields like "last action time"
                {"participant_twitter_username": "", "participant_twitter_id_str": ""}
            ],
            "group_manipulations":[ // array of objects
                {},
                {}
            ]
        }
    ],
}

exports.activeParticipant = {
    "exp_id": "",
    "group_id": "", 
    "participant_twitter_id_str" : "99999",
    "user_twitter_token": "sdgsdfg65565s6",
    "user_twitter_token_secret" : "",
    "group_manipulations":[ // array of objects
        {},
        {}
    ]
}

exports.action = { // Fields that are included in all actions
    "exp_id": "",
    "action_type" : "",
    "action_date": "",
    "participant_twitter_username" : "", // probably needs to be removed, if not, save username in users collection
    "participant_group_id": ""
}

exports.loginAction = {
    "exp_id": "",
    "action_type" : "login",
    "action_date": "",
    "participant_twitter_username" : "",
    "participant_group_id": ""
}

// For support of saving all the tweets appeared in an exp,
// maybe add new collection "tweetsIds in exps" where each doc has
// one object - the key is exp id, val is array of tweetsIds appreared in that exp.

// Maybe do above also for "actionsIds in exps"

exports.report = {
    // Details about the experiment
    "exp_id": "",
    "title": "",
    "description": "",
    "start_date": "",
    "end_date" : "", // Null if not ended yet
    "researcher_details": {
        "first_name": "", "last_name": "", "username": "",
    },
    "collabed_res": [
        {"first_name": "", "last_name": "", "username": ""},
    ],
    "num_of_participants": "",
    "status": "",
    "exp_groups": [ // array of objects
        {
            "group_id": "", // Group id within the experiment. Groups in different experiments may have the same id.
            "group_name": "",
            "group_num_of_participants": "",
            "group_size_in_percentage": "", //גודל הקבוצה באחוזים כפי שהחוקר הגדיר בצור ניסוי
            "group_participants": [ // array of objects
                {"participants_twitter_username": "", "last_action_time": ""}, // possibly more fields
                {"participants_twitter_username": "", "last_action_time": ""}
            ],
            "group_manipulations":[ // array of objects
                {},
                {}
            ]
        }
    ],
    // The main part, make it in a seperate file.
    "actions_log": [ // Array of objects
        // Each object represents an action by any of the participants

        // The fields which are included in all the action objects:
        {
            "action_date": "",
            "participant_twitter_username" : "",
            "participant_group_id": "",
            "action_type" : ""
        },
        // The other fields varies for each action type.
        // The possible action types:
        [
            //"first_login",
            "login",
            "logout",
            "view tweet", // Passively saw a tweet, in feed or in other tab (for example in public user's timleine) 
            "like", // Can be like on a tweet or comment
            "retweet",
            "comment",
            "quote",
            "tweeted", // Posted new tweet
            "view tweet full", // Went to the tweet's full page
            "view user profile", // Went to a public user profile page
            "follow",
            "unfollow",
            "click tweet media", // Clicked on a media that was attached to a tweet. For example - image, video, link
            "search"
            // Represent a tweet by Id, and save all the data in another json for easy retrieval  
        ]

    ]

}