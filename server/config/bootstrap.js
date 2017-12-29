/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

    var Twit = require('twit');
    var twitterCredentials = require('./twitterCredentials');

    var T = new Twit(twitterCredentials);
    var stream = T.stream('statuses/sample')

    stream.on('connect', request => {
        sails.log('Connecting...');
    });

    stream.on('connected', response => {
        sails.log('Done!');
    });

    // setInterval(() => {
    //     SystemService.getDinamicData().then(data => {
    //         sails.log('system data sended!');
    //         sails.sockets.broadcast('system', 'sys-dinamic', { data: data });
    //     })
    // }, 4000);
    // stream.on('tweet', tweets);

    function tweets(tweet) {
        let tempTweet = {
            created_at: tweet.created_at, //fecha de creacion
            // tweetId: tweet.id, // id Tweet
            strTweetId: tweet.id_str, // id como string
            text: tweet.text, // texto del tweet
            replyFromTweetId: tweet.in_reply_to_status_id, // (null || id)
            replyFromUserId: tweet.in_reply_to_user_id, // (null || id)
            replyFromUserScreenName: tweet.in_reply_to_screen_name, // (null || id)
            userId: tweet.user,
            user: tweet.user,
            // user: {
            //     id: 2244994945,
            //     id_str: '2244994945',
            //     name: 'TwitterDev',
            //     screen_name: 'TwitterDev',
            //     //location: 'Internet',
            //     url: 'https://dev.twitter.com/',
            //     profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
            //     //description: 'Your official source for Twitter Platform news, updates & events. Need technical help? Visit https://twittercommunity.com/ ⌨️ #TapIntoTwitter',
            //     verified: true,
            //     followers_count: 477684,
            //     friends_count: 1524,
            //     listed_count: 1184,
            //     favourites_count: 2151,
            //     statuses_count: 3121,
            //     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
            //     // utc_offset: -25200,
            //     // time_zone: 'Pacific Time (US & Canada)',
            //     // geo_enabled: true,
            //     lang: 'en',
            // },
            isQuoted: tweet.is_quote_status, // (bool) es una mencion el tweet 
            quotedId: tweet.quoted_status_id, // (null || id)
            quoteCount: tweet.quote_count,
            retweet: tweet.retweeted_status, //(null || {}) objeto tweet original
            retweetCount: tweet.retweet_count,
            replyCount: tweet.reply_count,
            favoriteCount: tweet.favorite_count,
            isFavorited: tweet.favorited, // si es favorito de una cuent autentificada
            isRetweeted: tweet.retweeted, // si es retwiteado por una cuenta autentificada
            // entities: tweet.entities,
            lang: tweet.lang
            // entities: {
            //     hashtags: [{
            //         text: 'hashtag',
            //     }],
            //     urls: [{
            //         // url: 'https://t.co/RzmrQ6wAzD',
            //         // expanded_url: 'http://bit.ly/2pUk4be',
            //         display_url: 'bit.ly/2pUk4be',
            //         // unwound: {
            //         //     url: 'https://blog.gnip.com/tweeting-in-the-rain/',
            //         //     status: 200,
            //         //     title: 'Tweeting in the Rain, Part 1 - Gnip Blog - Social Data and Data Science Blog',
            //         //     description: 'If you would have told me a few years ago that one day I’d be comparing precipitation and social media time-series data, I would have assumed you were joking.  For 13 years at OneRain I helped develop software and monitoring … Continue reading →'
            //         // },
            //     }],
            //     user_mentions: [{
            //         screen_name: "MentionThis",
            //         // name: "Just Me",
            //         id: 50247739,
            //         // id_str: "50247739",
            //     }],
            //     media: [{
            //         "id": 861627472244162561,
            //         "id_str": "861627472244162561",
            //         // "media_url": "http://pbs.twimg.com/media/C_UdnvPUwAE3Dnn.jpg",
            //         // "media_url_https": "https://pbs.twimg.com/media/C_UdnvPUwAE3Dnn.jpg",
            //         "url": "https://t.co/9r69akA484",
            //         "display_url": "pic.twitter.com/9r69akA484",
            //         // "expanded_url": "https://twitter.com/FloodSocial/status/861627479294746624/photo/1",
            //         "type": "photo"
            //     }]
            // }
        }
        if (tempTweet.retweet) {
            sails.log(tempTweet.retweet);
            Tweet2.create(tempTweet).exec((err, data) => {
                sails.log('created', err, data)
                // Tweet.message('new-tweet', data);
            });           // si es retweet 
            // sails.log(tempTweet.user.screen_name, ': ', tempTweet.text);
        } else {                            // es un tweet nuevo
            // sails.log('es nuevo');
        }
    }
    stream.on('disconnect', disconnectMessage => {
        sails.log('disconnected...', disconnectMessage);
    });
    // stream.on('user_event', (eventMsg) => {
    //     sails.log(eventMsg);
    // });
    // stream.on('reconnect', (request, response, connectInterval) => {
    //     //...
    // });

    cb();
};
