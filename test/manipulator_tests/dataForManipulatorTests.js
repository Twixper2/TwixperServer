// Export tweet objects, for each one explain what is unique about it

const manipulations = [
{
    "type": "mute",
    "users": ["premierleague", "LFC", "CAPEUSA"],
    "keywords": ["MUNLIV", "Roberto Firmino", "inspiring", "AAPIHM", "Heritage"]
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

const tweet1 = {
    "created_at": "Thu May 13 20:22:03 +0000 2021",
    "id": 1392938212251811840,
    "id_str": "1392938212251811840",
    "full_text": "GOAL Man Utd 1-3 Liverpool (47 mins)\n\nRoberto Firmino pounces on Dean Henderson's parry from Trent Alexander-Arnold's shot to steer home\n\n#MUNLIV",
    "truncated": false,
    "display_text_range": [
        0,
        145
    ],
    "entities": {
        "hashtags": [
            {
                "text": "MUNLIV",
                "indices": [
                    138,
                    145
                ]
            }
        ],
        "symbols": [],
        "user_mentions": [],
        "urls": []
    },
    "source": "<a href=\"https://www.spredfast.com/\" rel=\"nofollow\">Khoros Publishing</a>",
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
        "id": 343627165,
        "id_str": "343627165",
        "name": "Premier League",
        "screen_name": "premierleague",
        "location": "",
        "description": "The official Twitter account of the Premier League 📱 @OfficialFPL | 🇮🇳 @PLforIndia | 🇺🇸 @PLinUSA Join us on YouTube 👉 https://t.co/qj67qjcMYx",
        "url": "https://t.co/LYz84xq0Ze",
        "entities": {
            "url": {
                "urls": [
                    {
                        "url": "https://t.co/LYz84xq0Ze",
                        "expanded_url": "http://premierleague.com",
                        "display_url": "premierleague.com",
                        "indices": [
                            0,
                            23
                        ]
                    }
                ]
            },
            "description": {
                "urls": [
                    {
                        "url": "https://t.co/qj67qjcMYx",
                        "expanded_url": "http://youtube.com/premierleague",
                        "display_url": "youtube.com/premierleague",
                        "indices": [
                            118,
                            141
                        ]
                    }
                ]
            }
        },
        "protected": false,
        "followers_count": 26428620,
        "friends_count": 82,
        "listed_count": 27842,
        "created_at": "Wed Jul 27 21:09:32 +0000 2011",
        "favourites_count": 1920,
        "utc_offset": null,
        "time_zone": null,
        "geo_enabled": true,
        "verified": true,
        "statuses_count": 129277,
        "lang": null,
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": true,
        "profile_background_color": "050528",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile": false,
        "profile_image_url": "http://pbs.twimg.com/profile_images/1338425972253728769/Km-hIKAs_normal.jpg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/1338425972253728769/Km-hIKAs_normal.jpg",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/343627165/1620635956",
        "profile_link_color": "93A644",
        "profile_sidebar_border_color": "FFFFFF",
        "profile_sidebar_fill_color": "171838",
        "profile_text_color": "FFFFFF",
        "profile_use_background_image": false,
        "has_extended_profile": false,
        "default_profile": false,
        "default_profile_image": false,
        "following": true,
        "follow_request_sent": false,
        "notifications": false,
        "translator_type": "none",
        "withheld_in_countries": []
    },
    "geo": null,
    "coordinates": null,
    "place": null,
    "contributors": null,
    "is_quote_status": false,
    "retweet_count": 218,
    "favorite_count": 1969,
    "favorited": false,
    "retweeted": false,
    "lang": "en"
}

const tweetWithLfcMentioned = {
    "created_at": "Thu May 13 20:04:36 +0000 2021",
    "id": 1392933819154583557,
    "id_str": "1392933819154583557",
    "full_text": "HALF-TIME Man Utd 1-2 Liverpool\n\n@LFC lead at the break after responding to Bruno Fernandes' deflected opener with goals from Diogo Jota and Roberto Firmino \n\n#MUNLIV https://t.co/GkHSzdq4dz",
    "truncated": false,
    "display_text_range": [
        0,
        166
    ],
    "entities": {
        "hashtags": [
            {
                "text": "MUNLIV",
                "indices": [
                    159,
                    166
                ]
            }
        ],
        "symbols": [],
        "user_mentions": [
            {
                "screen_name": "LFC",
                "name": "Liverpool FC",
                "id": 19583545,
                "id_str": "19583545",
                "indices": [
                    33,
                    37
                ]
            }
        ],
        "urls": [],
        "media": [
            {
                "id": 1392933812531830788,
                "id_str": "1392933812531830788",
                "indices": [
                    167,
                    190
                ],
                "media_url": "http://pbs.twimg.com/media/E1Sx7COXIAQqwoT.jpg",
                "media_url_https": "https://pbs.twimg.com/media/E1Sx7COXIAQqwoT.jpg",
                "url": "https://t.co/GkHSzdq4dz",
                "display_url": "pic.twitter.com/GkHSzdq4dz",
                "expanded_url": "https://twitter.com/premierleague/status/1392933819154583557/photo/1",
                "type": "photo",
                "sizes": {
                    "thumb": {
                        "w": 150,
                        "h": 150,
                        "resize": "crop"
                    },
                    "large": {
                        "w": 1639,
                        "h": 2048,
                        "resize": "fit"
                    },
                    "small": {
                        "w": 544,
                        "h": 680,
                        "resize": "fit"
                    },
                    "medium": {
                        "w": 960,
                        "h": 1200,
                        "resize": "fit"
                    }
                }
            }
        ]
    },
    "extended_entities": {
        "media": [
            {
                "id": 1392933812531830788,
                "id_str": "1392933812531830788",
                "indices": [
                    167,
                    190
                ],
                "media_url": "http://pbs.twimg.com/media/E1Sx7COXIAQqwoT.jpg",
                "media_url_https": "https://pbs.twimg.com/media/E1Sx7COXIAQqwoT.jpg",
                "url": "https://t.co/GkHSzdq4dz",
                "display_url": "pic.twitter.com/GkHSzdq4dz",
                "expanded_url": "https://twitter.com/premierleague/status/1392933819154583557/photo/1",
                "type": "photo",
                "sizes": {
                    "thumb": {
                        "w": 150,
                        "h": 150,
                        "resize": "crop"
                    },
                    "large": {
                        "w": 1639,
                        "h": 2048,
                        "resize": "fit"
                    },
                    "small": {
                        "w": 544,
                        "h": 680,
                        "resize": "fit"
                    },
                    "medium": {
                        "w": 960,
                        "h": 1200,
                        "resize": "fit"
                    }
                }
            },
            {
                "id": 1392933816675835905,
                "id_str": "1392933816675835905",
                "indices": [
                    167,
                    190
                ],
                "media_url": "http://pbs.twimg.com/media/E1Sx7RqXoAEnxEE.jpg",
                "media_url_https": "https://pbs.twimg.com/media/E1Sx7RqXoAEnxEE.jpg",
                "url": "https://t.co/GkHSzdq4dz",
                "display_url": "pic.twitter.com/GkHSzdq4dz",
                "expanded_url": "https://twitter.com/premierleague/status/1392933819154583557/photo/1",
                "type": "photo",
                "sizes": {
                    "thumb": {
                        "w": 150,
                        "h": 150,
                        "resize": "crop"
                    },
                    "small": {
                        "w": 544,
                        "h": 680,
                        "resize": "fit"
                    },
                    "medium": {
                        "w": 960,
                        "h": 1200,
                        "resize": "fit"
                    },
                    "large": {
                        "w": 1545,
                        "h": 1931,
                        "resize": "fit"
                    }
                }
            }
        ]
    },
    "source": "<a href=\"https://www.spredfast.com/\" rel=\"nofollow\">Khoros Publishing</a>",
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
        "id": 343627165,
        "id_str": "343627165",
        "name": "Premier League",
        "screen_name": "premierleague",
        "location": "",
        "description": "The official Twitter account of the Premier League 📱 @OfficialFPL | 🇮🇳 @PLforIndia | 🇺🇸 @PLinUSA Join us on YouTube 👉 https://t.co/qj67qjcMYx",
        "url": "https://t.co/LYz84xq0Ze",
        "entities": {
            "url": {
                "urls": [
                    {
                        "url": "https://t.co/LYz84xq0Ze",
                        "expanded_url": "http://premierleague.com",
                        "display_url": "premierleague.com",
                        "indices": [
                            0,
                            23
                        ]
                    }
                ]
            },
            "description": {
                "urls": [
                    {
                        "url": "https://t.co/qj67qjcMYx",
                        "expanded_url": "http://youtube.com/premierleague",
                        "display_url": "youtube.com/premierleague",
                        "indices": [
                            118,
                            141
                        ]
                    }
                ]
            }
        },
        "protected": false,
        "followers_count": 26430827,
        "friends_count": 82,
        "listed_count": 27846,
        "created_at": "Wed Jul 27 21:09:32 +0000 2011",
        "favourites_count": 1920,
        "utc_offset": null,
        "time_zone": null,
        "geo_enabled": true,
        "verified": true,
        "statuses_count": 129277,
        "lang": null,
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": true,
        "profile_background_color": "050528",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile": false,
        "profile_image_url": "http://pbs.twimg.com/profile_images/1338425972253728769/Km-hIKAs_normal.jpg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/1338425972253728769/Km-hIKAs_normal.jpg",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/343627165/1620635956",
        "profile_link_color": "93A644",
        "profile_sidebar_border_color": "FFFFFF",
        "profile_sidebar_fill_color": "171838",
        "profile_text_color": "FFFFFF",
        "profile_use_background_image": false,
        "has_extended_profile": false,
        "default_profile": false,
        "default_profile_image": false,
        "following": true,
        "follow_request_sent": false,
        "notifications": false,
        "translator_type": "none",
        "withheld_in_countries": []
    },
    "geo": null,
    "coordinates": null,
    "place": null,
    "contributors": null,
    "is_quote_status": false,
    "retweet_count": 239,
    "favorite_count": 2365,
    "favorited": false,
    "retweeted": false,
    "possibly_sensitive": false,
    "possibly_sensitive_appealable": false,
    "lang": "en"
}

// Original author is LFC, retweeter is premierleague
const retweet = {
    "created_at": "Thu May 13 18:15:04 +0000 2021",
    "id": 1392906254129975300,
    "id_str": "1392906254129975300",
    "full_text": "⚽️ #MUNLIV 𝐓𝐄𝐀𝐌 𝐍𝐄𝐖𝐒 ⚽️\n\nOur line-up to take on @ManUtd 👊",
    "truncated": false,
    "display_text_range": [
        0,
        57
    ],
    "entities": {
        "hashtags": [
            {
                "text": "MUNLIV",
                "indices": [
                    3,
                    10
                ]
            }
        ],
        "symbols": [],
        "user_mentions": [
            {
                "screen_name": "ManUtd",
                "name": "Manchester United",
                "id": 558797310,
                "id_str": "558797310",
                "indices": [
                    48,
                    55
                ]
            }
        ],
        "urls": []
    },
    "source": "<a href=\"https://ads-api.twitter.com\" rel=\"nofollow\">Twitter for Advertisers (legacy)</a>",
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
        "id": 19583545,
        "id_str": "19583545",
        "name": "Liverpool FC",
        "screen_name": "LFC",
        "location": "Anfield",
        "description": "Official Twitter account of Liverpool Football Club 🔴 Stop The Hate, Stand Up, Report It. #RedTogether ✊",
        "url": "https://t.co/CriS4SxGXd",
        "entities": {
            "url": {
                "urls": [
                    {
                        "url": "https://t.co/CriS4SxGXd",
                        "expanded_url": "https://www.liverpoolfc.com/reportabuse",
                        "display_url": "liverpoolfc.com/reportabuse",
                        "indices": [
                            0,
                            23
                        ]
                    }
                ]
            },
            "description": {
                "urls": []
            }
        },
        "protected": false,
        "followers_count": 17182862,
        "friends_count": 364713,
        "listed_count": 25125,
        "created_at": "Tue Jan 27 09:05:21 +0000 2009",
        "favourites_count": 14717,
        "utc_offset": null,
        "time_zone": null,
        "geo_enabled": true,
        "verified": true,
        "statuses_count": 95210,
        "lang": null,
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": true,
        "profile_background_color": "FAF5F7",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile": false,
        "profile_image_url": "http://pbs.twimg.com/profile_images/1389476794533924864/QQUYKvAX_normal.png",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/1389476794533924864/QQUYKvAX_normal.png",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/19583545/1619704136",
        "profile_link_color": "B40B43",
        "profile_sidebar_border_color": "FFFFFF",
        "profile_sidebar_fill_color": "FAFAFA",
        "profile_text_color": "CC0000",
        "profile_use_background_image": false,
        "has_extended_profile": false,
        "default_profile": false,
        "default_profile_image": false,
        "following": false,
        "follow_request_sent": false,
        "notifications": false,
        "translator_type": "none",
        "withheld_in_countries": []
    },
    "geo": null,
    "coordinates": null,
    "place": null,
    "contributors": null,
    "is_quote_status": false,
    "retweet_count": 1947,
    "favorite_count": 11616,
    "favorited": false,
    "retweeted": false,
    "lang": "en"
}

// Original author is CAPEUSA, quoter is tedlieu
const quote = {
    "created_at": "Wed May 12 16:23:06 +0000 2021",
    "id": 1392515686501556235,
    "id_str": "1392515686501556235",
    "full_text": "Sharing this moving and inspiring piece celebrating the incredible impact Asian Americans and Pacific Islanders have had on the world through art. #StopAsianHate https://t.co/EPkm328tT4",
    "truncated": false,
    "display_text_range": [
        0,
        161
    ],
    "entities": {
        "hashtags": [
            {
                "text": "StopAsianHate",
                "indices": [
                    147,
                    161
                ]
            }
        ],
        "symbols": [],
        "user_mentions": [],
        "urls": [
            {
                "url": "https://t.co/EPkm328tT4",
                "expanded_url": "https://twitter.com/CAPEUSA/status/1392464587082010625",
                "display_url": "twitter.com/CAPEUSA/status…",
                "indices": [
                    162,
                    185
                ]
            }
        ]
    },
    "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
        "id": 21059255,
        "id_str": "21059255",
        "name": "Ted Lieu",
        "screen_name": "tedlieu",
        "location": "California",
        "description": "Husband of Betty, the love of my life. Father of two great kids. USAF veteran. Member of Congress. In that order. Also, empathy is good.",
        "url": "https://t.co/YZX138uDSy",
        "entities": {
            "url": {
                "urls": [
                    {
                        "url": "https://t.co/YZX138uDSy",
                        "expanded_url": "http://www.TedLieu.com",
                        "display_url": "TedLieu.com",
                        "indices": [
                            0,
                            23
                        ]
                    }
                ]
            },
            "description": {
                "urls": []
            }
        },
        "protected": false,
        "followers_count": 1633394,
        "friends_count": 10508,
        "listed_count": 8120,
        "created_at": "Tue Feb 17 03:12:31 +0000 2009",
        "favourites_count": 82526,
        "utc_offset": null,
        "time_zone": null,
        "geo_enabled": true,
        "verified": true,
        "statuses_count": 29458,
        "lang": null,
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": false,
        "profile_background_color": "022330",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme15/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme15/bg.png",
        "profile_background_tile": false,
        "profile_image_url": "http://pbs.twimg.com/profile_images/537271043937673217/3O1qePzP_normal.jpeg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/537271043937673217/3O1qePzP_normal.jpeg",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/21059255/1611191730",
        "profile_link_color": "0084B4",
        "profile_sidebar_border_color": "A8C7F7",
        "profile_sidebar_fill_color": "C0DFEC",
        "profile_text_color": "333333",
        "profile_use_background_image": false,
        "has_extended_profile": false,
        "default_profile": false,
        "default_profile_image": false,
        "following": false,
        "follow_request_sent": false,
        "notifications": false,
        "translator_type": "none",
        "withheld_in_countries": []
    },
    "geo": null,
    "coordinates": null,
    "place": null,
    "contributors": null,
    "is_quote_status": true,
    "quoted_status_id": 1392464587082010625,
    "quoted_status_id_str": "1392464587082010625",
    "quoted_status_permalink": {
        "url": "https://t.co/EPkm328tT4",
        "expanded": "https://twitter.com/CAPEUSA/status/1392464587082010625",
        "display": "twitter.com/CAPEUSA/status…"
    },
    "quoted_status": {
        "created_at": "Wed May 12 13:00:02 +0000 2021",
        "id": 1392464587082010625,
        "id_str": "1392464587082010625",
        "full_text": "In honor of Asian American &amp; Pacific Islander Heritage Month (#AAPIHM), we are proud to share “Awakening,” a celebration of #AsianAmerican artists, with a spotlight on artists whose work has changed the world. #StopAsianHate #AAPIHeritageMonth https://t.co/F4qkbRqEM9",
        "truncated": false,
        "display_text_range": [
            0,
            247
        ],
        "entities": {
            "hashtags": [
                {
                    "text": "AAPIHM",
                    "indices": [
                        66,
                        73
                    ]
                },
                {
                    "text": "AsianAmerican",
                    "indices": [
                        128,
                        142
                    ]
                },
                {
                    "text": "StopAsianHate",
                    "indices": [
                        214,
                        228
                    ]
                },
                {
                    "text": "AAPIHeritageMonth",
                    "indices": [
                        229,
                        247
                    ]
                }
            ],
            "symbols": [],
            "user_mentions": [],
            "urls": [],
            "media": [
                {
                    "id": 1392250846612639745,
                    "id_str": "1392250846612639745",
                    "indices": [
                        248,
                        271
                    ],
                    "media_url": "http://pbs.twimg.com/media/E1JGZ4uVcAAILjH.jpg",
                    "media_url_https": "https://pbs.twimg.com/media/E1JGZ4uVcAAILjH.jpg",
                    "url": "https://t.co/F4qkbRqEM9",
                    "display_url": "pic.twitter.com/F4qkbRqEM9",
                    "expanded_url": "https://twitter.com/CAPEUSA/status/1392464587082010625/video/1",
                    "type": "photo",
                    "sizes": {
                        "thumb": {
                            "w": 150,
                            "h": 150,
                            "resize": "crop"
                        },
                        "large": {
                            "w": 2048,
                            "h": 1152,
                            "resize": "fit"
                        },
                        "medium": {
                            "w": 1200,
                            "h": 675,
                            "resize": "fit"
                        },
                        "small": {
                            "w": 680,
                            "h": 383,
                            "resize": "fit"
                        }
                    }
                }
            ]
        },
        "extended_entities": {
            "media": [
                {
                    "id": 1392250846612639745,
                    "id_str": "1392250846612639745",
                    "indices": [
                        248,
                        271
                    ],
                    "media_url": "http://pbs.twimg.com/media/E1JGZ4uVcAAILjH.jpg",
                    "media_url_https": "https://pbs.twimg.com/media/E1JGZ4uVcAAILjH.jpg",
                    "url": "https://t.co/F4qkbRqEM9",
                    "display_url": "pic.twitter.com/F4qkbRqEM9",
                    "expanded_url": "https://twitter.com/CAPEUSA/status/1392464587082010625/video/1",
                    "type": "video",
                    "sizes": {
                        "thumb": {
                            "w": 150,
                            "h": 150,
                            "resize": "crop"
                        },
                        "large": {
                            "w": 2048,
                            "h": 1152,
                            "resize": "fit"
                        },
                        "medium": {
                            "w": 1200,
                            "h": 675,
                            "resize": "fit"
                        },
                        "small": {
                            "w": 680,
                            "h": 383,
                            "resize": "fit"
                        }
                    },
                    "video_info": {
                        "aspect_ratio": [
                            16,
                            9
                        ],
                        "duration_millis": 441167,
                        "variants": [
                            {
                                "bitrate": 288000,
                                "content_type": "video/mp4",
                                "url": "https://video.twimg.com/amplify_video/1392250846612639745/vid/480x270/kK7spTAg8jCU2j6k.mp4?tag=14"
                            },
                            {
                                "bitrate": 2176000,
                                "content_type": "video/mp4",
                                "url": "https://video.twimg.com/amplify_video/1392250846612639745/vid/1280x720/4Lpq3Q0m6Hy7zQV1.mp4?tag=14"
                            },
                            {
                                "content_type": "application/x-mpegURL",
                                "url": "https://video.twimg.com/amplify_video/1392250846612639745/pl/28xDNryrC7XgffM-.m3u8?tag=14"
                            },
                            {
                                "bitrate": 832000,
                                "content_type": "video/mp4",
                                "url": "https://video.twimg.com/amplify_video/1392250846612639745/vid/640x360/khuNn44ytPxxOv4i.mp4?tag=14"
                            }
                        ]
                    },
                    "additional_media_info": {
                        "title": "AWAKENING: An Anthemic Celebration of Asian America",
                        "description": "In honor of Asian American & Pacific Islander Heritage Month, we are proud to share “Awakening,” a celebration of Asian American artists, with a spotlight on artists whose work has changed the world.\n",
                        "embeddable": true,
                        "monetizable": false
                    }
                }
            ]
        },
        "source": "<a href=\"https://studio.twitter.com\" rel=\"nofollow\">Twitter Media Studio</a>",
        "in_reply_to_status_id": null,
        "in_reply_to_status_id_str": null,
        "in_reply_to_user_id": null,
        "in_reply_to_user_id_str": null,
        "in_reply_to_screen_name": null,
        "user": {
            "id": 44474987,
            "id_str": "44474987",
            "name": "CAPE—Coalition of Asian Pacifics in Entertainment",
            "screen_name": "CAPEUSA",
            "location": "Los Angeles, CA",
            "description": "CAPE champions diversity by educating, connecting, and empowering #AAPI artists and leaders in entertainment and media. Since 1991. | Instagram:@capeusa",
            "url": "https://t.co/TFxGdzfhLa",
            "entities": {
                "url": {
                    "urls": [
                        {
                            "url": "https://t.co/TFxGdzfhLa",
                            "expanded_url": "http://linktr.ee/capeusa/",
                            "display_url": "linktr.ee/capeusa/",
                            "indices": [
                                0,
                                23
                            ]
                        }
                    ]
                },
                "description": {
                    "urls": []
                }
            },
            "protected": false,
            "followers_count": 13276,
            "friends_count": 2862,
            "listed_count": 232,
            "created_at": "Wed Jun 03 22:25:34 +0000 2009",
            "favourites_count": 21625,
            "utc_offset": null,
            "time_zone": null,
            "geo_enabled": true,
            "verified": true,
            "statuses_count": 23204,
            "lang": null,
            "contributors_enabled": false,
            "is_translator": false,
            "is_translation_enabled": false,
            "profile_background_color": "FFFFFF",
            "profile_background_image_url": "http://abs.twimg.com/images/themes/theme6/bg.gif",
            "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme6/bg.gif",
            "profile_background_tile": true,
            "profile_image_url": "http://pbs.twimg.com/profile_images/1017122021476524032/IM1oeYC6_normal.jpg",
            "profile_image_url_https": "https://pbs.twimg.com/profile_images/1017122021476524032/IM1oeYC6_normal.jpg",
            "profile_banner_url": "https://pbs.twimg.com/profile_banners/44474987/1612557154",
            "profile_link_color": "E63D09",
            "profile_sidebar_border_color": "FFFFFF",
            "profile_sidebar_fill_color": "F9FFAF",
            "profile_text_color": "191615",
            "profile_use_background_image": true,
            "has_extended_profile": false,
            "default_profile": false,
            "default_profile_image": false,
            "following": false,
            "follow_request_sent": false,
            "notifications": false,
            "translator_type": "none",
            "withheld_in_countries": []
        },
        "geo": null,
        "coordinates": null,
        "place": null,
        "contributors": null,
        "is_quote_status": false,
        "retweet_count": 207,
        "favorite_count": 760,
        "favorited": false,
        "retweeted": false,
        "possibly_sensitive": false,
        "possibly_sensitive_appealable": false,
        "lang": "en"
    },
    "retweet_count": 142,
    "favorite_count": 547,
    "favorited": false,
    "retweeted": false,
    "possibly_sensitive": false,
    "possibly_sensitive_appealable": false,
    "lang": "en"
}

const innocentTweet = {
    "created_at": "Thu May 13 21:11:46 +0000 2021",
    "id": 1392950720979030019,
    "id_str": "1392950720979030019",
    "full_text": "To be clear, I strongly believe in crypto, but it can’t drive a massive increase in fossil fuel use, especially coal",
    "truncated": false,
    "display_text_range": [
        0,
        116
    ],
    "entities": {
        "hashtags": [],
        "symbols": [],
        "user_mentions": [],
        "urls": []
    },
    "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
        "id": 44196397,
        "id_str": "44196397",
        "name": "Elon Musk",
        "screen_name": "elonmusk",
        "location": "",
        "description": "Technoking of Tesla, Imperator of Mars 😉",
        "url": null,
        "entities": {
            "description": {
                "urls": []
            }
        },
        "protected": false,
        "followers_count": 54410653,
        "friends_count": 106,
        "listed_count": 71121,
        "created_at": "Tue Jun 02 20:12:29 +0000 2009",
        "favourites_count": 8721,
        "utc_offset": null,
        "time_zone": null,
        "geo_enabled": false,
        "verified": true,
        "statuses_count": 14270,
        "lang": null,
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": false,
        "profile_background_color": "C0DEED",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile": false,
        "profile_image_url": "http://pbs.twimg.com/profile_images/1383184766959120385/MM9DHPWC_normal.jpg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/1383184766959120385/MM9DHPWC_normal.jpg",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/44196397/1576183471",
        "profile_link_color": "0084B4",
        "profile_sidebar_border_color": "C0DEED",
        "profile_sidebar_fill_color": "DDEEF6",
        "profile_text_color": "333333",
        "profile_use_background_image": true,
        "has_extended_profile": true,
        "default_profile": false,
        "default_profile_image": false,
        "following": true,
        "follow_request_sent": false,
        "notifications": false,
        "translator_type": "none",
        "withheld_in_countries": []
    },
    "geo": null,
    "coordinates": null,
    "place": null,
    "contributors": null,
    "is_quote_status": false,
    "retweet_count": 7330,
    "favorite_count": 50748,
    "favorited": false,
    "retweeted": false,
    "lang": "en"
}

module.exports = {
    manipulations, tweet1, tweetWithLfcMentioned, retweet, quote, innocentTweet
}