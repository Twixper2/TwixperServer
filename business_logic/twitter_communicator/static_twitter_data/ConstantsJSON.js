let twitter_address = 'https://twitter.com/';
let twitter_home_address = 'https://twitter.com/home';
let status_text = 'status';
let user_credentials = {
  correct_credentials: {
    credentials_1: {
      user: 'colabmail',
      pass: 'LiadMosheDini',
    },
    credentials_2: {
      user: 'lab_twit',
      pass: 'LiadMosheDini',
    },
  },
  incorrect_credentials: {
    credentials_3: {
      user: 'lab_twit122',
      pass: 'LiadMosheDini',
    },
    credentials_4: {
      user: 'lab_twit',
      pass: 'LiadMosheDini1',
    },
  },
};
let auth_constants = {
  username_x_path:
    '/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[5]/label/div/div[2]/div/input',
};
let entity_constants = {
  sizes: {
    thumb: {
      w: 150,
      h: 150,
      resize: 'crop',
    },
    medium: {
      w: 1200,
      h: 675,
      resize: 'fit',
    },
    small: {
      w: 680,
      h: 383,
      resize: 'fit',
    },
    large: {
      w: 1280,
      h: 720,
      resize: 'fit',
    },
  },
  entities: { hashtags: [], symbols: [], user_mentions: [], urls: [], media: [] },
};
let selenium_constants = {
  attribute_names: {
    aria_label: 'aria-label',
    aria_labelledby: 'aria-labelledby',
    data_test_id: 'data-testid',
    role: 'role',
    href: 'href',
    src: 'src',
    img: 'img',
    a: 'a',
  },
  attribute_values: {
    primaryColumn: 'primaryColumn',
    UserName: 'UserName',
    UserDescription: 'UserDescription',
    UserLocation: 'UserLocation',
    UserUrl: 'UserUrl',
    UserProfessionalCategory: 'UserProfessionalCategory',
    heading: 'heading',
    placementTracking: 'placementTracking',
    presentation: 'presentation',
    link: 'link',
    button: 'button',
    group: 'group',
    socialContext: 'socialContext',
    tweetText: 'tweetText',
    tweetPhoto: 'tweetPhoto',
    verifiedAccount: 'Verified account',
    whoToFollow: 'Who to follow',
    UserCell: 'UserCell',
    article: 'article',
  },
};

exports.twitter_address = twitter_address;
exports.twitter_home_address = twitter_home_address;
exports.status_text = status_text;
exports.auth_constants = auth_constants;
exports.entity_constants = entity_constants;
exports.user_credentials = user_credentials;
exports.selenium_constants = selenium_constants;
