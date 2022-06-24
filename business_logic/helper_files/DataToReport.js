exports.customReqResHeaders = {
    'User-Twitter-Token': "oauthToken",
    'User-Twitter-Token-Secret': "oauthTokenSecret",

    'Researcher-Id': "researcherId"
}

exports.researcher = {
    // Details we get from google sign in
    "researcher_id" : "ABCD1234-1234",
    "researcher_username": "Nir Dzouraev",
    "researcher_email": "xxx@post.bgu.ac.il",
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
    "exp_code": "", // Null (or missing) if Draft
    "title": "",
    "description": "",
    "start_date": "", // Null (or missing) if not started yet
    "end_date" : "", // Null (or missing) if not ended yet
    "status": "", // draft, active, closed
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
    "participant_twitter_username": "twixperApp",
    "participant_twitter_name": "Twixper",
    "participant_twitter_friends_count": 43,
    "participant_twitter_followers_count": 11,
    "participant_twitter_profile_image": "https://pbs.twimg.com/profile_images/1316848349618860033/5ii_bkh9_normal.jpg",
    "participant_email": "abc@gmail.com", // Can be null
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
        // Actions that contains the relevent tweet object will contain the field "tweet_obj"
        // Actions that contains the relevent user object will contain the field "user_obj"
        // "clicked tweet media" contains the relevent clicked media object - field "media_obj_clicked"
        // "clicked tweet url" contains the field "url_clicked"
        // "clicked tweet url with preview" contains the field "url_clicked" and "link_preview_details"
        // "searched" contains the field "query"

        // The possible action types:
        [
            "registered to experiment",
            "login", 
            "",
            "view tweet", // Passively saw a tweet, in feed or in other tab (for example in public user's timleine) 
            "like", // Can be like on a tweet or comment
            "unlike", 
            "retweeted", 
            "replied", 
            "quoted", 
            "tweeted", // Posted new tweet
            "view tweet page", // Went to the tweet's full page
            "view user page", // Went to a public user profile page
            "follow", 
            "unfollow", 
            "searched tweets",
            "searched users",
            "clicked tweet media photo", // Clicked on a photo that was attached to a tweet.
            "clicked tweet media video", // Clicked on a video that was attached to a tweet.
            "clicked tweet url", // Clicked on a url that was in a tweet.
            "clicked tweet url with preview", // Clicked on a link-preview that was in a tweet.
            "muted tweet (manipulation)", // A tweet that was muted
            "injected tweet (manipulation)",
            "pixelated media (manipulation)",
            "removed media (manipulation)"
        ]
        ,
        {
            action_type: "muted tweet (manipulation)",
            action_date: "",
            participant_twitter_username: "",
            participant_group_id: "",
            tweet_obj: {}
        },
    ]

}