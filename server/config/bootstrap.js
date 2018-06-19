

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

    // Conexion a twitter 

    var Twit = require('twit');
    var twitterCredentials = require('./twitterCredentials');
    var T = new Twit(twitterCredentials);
    var stream = T.stream('statuses/sample', { language: 'es' });

    //lista dinamica de los tweets relevantes
    var tl = require('../api/class/TweetList');
    // var TweetList = new tl.TweetList(10, 1, 'normTotal');
    var RetweetList = new tl.TweetList(10, 90);
    var ReplyList = new tl.TweetList(10, 90);
    var QuoteList = new tl.TweetList(10, 90);
    var FavoriteList = new tl.TweetList(10, 90);



    stream.on('connect', request => {
        sails.log('Connecting...');
    });

    stream.on('connected', response => {
        sails.log('Done!');
    });

    stream.on('disconnect', disconnectMessage => {
        sails.log('disconnected...', disconnectMessage);
    });

    setInterval(() => {
        SystemService.getDinamicData().then(data => {
            sails.log('system data sended!');
            sails.sockets.broadcast('system', 'sys-dinamic', { data: data });
        });
    }, 4000);

    var interaval = 10 * 1000;

    setInterval(() => {
        sails.sockets.broadcast('tweet-lists', 'new-list', { where: 'RP', list: ReplyList.list });
        sails.sockets.broadcast('tweet-lists', 'new-list', { where: 'RT', list: RetweetList.list });
        sails.sockets.broadcast('tweet-lists', 'new-list', { where: 'FV', list: FavoriteList.list });
        sails.sockets.broadcast('tweet-lists', 'new-list', { where: 'QT', list: QuoteList.list });

        // ReplyList.substract();
        // RetweetList.substract();
        // ponderationService.subtractMaxValues();
    }, interaval);

    setTimeout(() => {
        stream.on('tweet', tweets);
    }, 4000);

    function tweets(tweet) {
        // var tempTweet = {
        //     created_at: tweet.created_at, //fecha de creacion
        //     // tweetId: tweet.id, // id Tweet
        //     strTweetId: tweet.id_str, // id como string
        //     text: tweet.text, // texto del tweet
        //     replyFromTweetId: tweet.in_reply_to_status_id, // (null || id)
        //     replyFromUserId: tweet.in_reply_to_user_id, // (null || id)
        //     replyFromUserScreenName: tweet.in_reply_to_screen_name, // (null || id)
        //     // userId: tweet.user.id_str,
        //     user: tweet.user,
        //     // user: {
        //     //     id: 2244994945,
        //     //     id_str: '2244994945',
        //     //     name: 'TwitterDev',
        //     //     screen_name: 'TwitterDev',
        //     //     //location: 'Internet',
        //     //     url: 'https://dev.twitter.com/',
        //     //     profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
        //     //     //description: 'Your official source for Twitter Platform news, updates & events. Need technical help? Visit https://twittercommunity.com/ ⌨️ #TapIntoTwitter',
        //     //     verified: true,
        //     //     followers_count: 477684,
        //     //     friends_count: 1524,
        //     //     listed_count: 1184,
        //     //     favourites_count: 2151,
        //     //     statuses_count: 3121,
        //     //     created_at: 'Sat Dec 14 04:35:55 +0000 2013',
        //     //     // utc_offset: -25200,
        //     //     // time_zone: 'Pacific Time (US & Canada)',
        //     //     // geo_enabled: true,
        //     //     lang: 'en',
        //     // },
        //     isQuoted: tweet.is_quote_status, // (bool) es una mencion el tweet 
        //     quotedId: tweet.quoted_status_id, // (null || id)
        //     quoteCount: tweet.quote_count,
        //     retweet: tweet.retweeted_status, //(null || {}) objeto tweet original
        //     retweetCount: tweet.retweet_count,
        //     replyCount: tweet.reply_count,
        //     favoriteCount: tweet.favorite_count,
        //     isFavorited: tweet.favorited, // si es favorito de una cuent autentificada
        //     isRetweeted: tweet.retweeted, // si es retwiteado por una cuenta autentificada
        //     // entities: tweet.entities,
        //     lang: tweet.lang
        //     // entities: {
        //     //     hashtags: [{
        //     //         text: 'hashtag',
        //     //     }],
        //     //     urls: [{
        //     //         // url: 'https://t.co/RzmrQ6wAzD',
        //     //         // expanded_url: 'http://bit.ly/2pUk4be',
        //     //         display_url: 'bit.ly/2pUk4be',
        //     //         // unwound: {
        //     //         //     url: 'https://blog.gnip.com/tweeting-in-the-rain/',
        //     //         //     status: 200,
        //     //         //     title: 'Tweeting in the Rain, Part 1 - Gnip Blog - Social Data and Data Science Blog',
        //     //         //     description: 'If you would have told me a few years ago that one day I’d be comparing precipitation and social media time-series data, I would have assumed you were joking.  For 13 years at OneRain I helped develop software and monitoring … Continue reading →'
        //     //         // },
        //     //     }],
        //     //     user_mentions: [{
        //     //         screen_name: "MentionThis",
        //     //         // name: "Just Me",
        //     //         id: 50247739,
        //     //         // id_str: "50247739",
        //     //     }],
        //     //     media: [{
        //     //         "id": 861627472244162561,
        //     //         "id_str": "861627472244162561",
        //     //         // "media_url": "http://pbs.twimg.com/media/C_UdnvPUwAE3Dnn.jpg",
        //     //         // "media_url_https": "https://pbs.twimg.com/media/C_UdnvPUwAE3Dnn.jpg",
        //     //         "url": "https://t.co/9r69akA484",
        //     //         "display_url": "pic.twitter.com/9r69akA484",
        //     //         // "expanded_url": "https://twitter.com/FloodSocial/status/861627479294746624/photo/1",
        //     //         "type": "photo"
        //     //     }]
        //     // }
        // };
        if (tweet.retweeted_status) {
            tempTweet = tweet.retweeted_status;
            tempTweet.quoteCount = tweet.retweeted_status.quote_count;
            tempTweet.replyCount = tweet.retweeted_status.reply_count;
            tempTweet.retweetCount = tweet.retweeted_status.retweet_count;
            tempTweet.favoriteCount = tweet.retweeted_status.favorite_count;

            // let minTweet = TweetList.getLast() || { normTotal: 0 }; // min values
            let minReply = ReplyList.getLast() || { replyCount: 0 };
            let minRetweet = RetweetList.getLast() || { retweetCount: 0 };
            let minFavorite = FavoriteList.getLast() || { favoriteCount: 0 };
            let minQuote = QuoteList.getLast() || { quoteCount: 0 };

            // tempTweet.normFavorite = ponderationService.normFavorite(tempTweet.favoriteCount);
            // tempTweet.normReply = ponderationService.normReply(tempTweet.replyCount);
            // // tempTweet.normRetweet = ponderationService.normRetweet(tempTweet.retweetCount);
            // // tempTweet.normQuote = ponderationService.normQuote(tempTweet.quoteCount);

            // // tempTweet.normFavorite = ponderationService.norm(tempTweet.favoriteCount, minTweet.favoriteCount);
            // tempTweet.normReply = ponderationService.norm(tempTweet.replyCount, minReply.value);
            // tempTweet.normRetweet = ponderationService.norm(tempTweet.retweetCount, minTweet.retweetCount);
            // tempTweet.normQuote = ponderationService.norm(tempTweet.quoteCount, minTweet.quoteCount);
            // tempTweet.normTotal = ponderationService.ponderate(tempTweet);
            //replyCount
            // if (tempTweet.normTotal > minTweet.normTotal) {
            //     console.log('1',tempTweet.normTotal, minTweet.normTotal);
            //     TweetList.add(tempTweet, 'normTotal');
            //     TweetList.list.forEach(l => l.normTotal = ponderationService.ponderate(l));
            //     sails.sockets.broadcast('tweet-lists', 'new-list', { where: 'normTotal', list: TweetList.list });
            //     // Tweet.message('', TweetList);
            //     // sails.log('es nuevo', tempTweet);
            // }
            if (tempTweet.replyCount > minReply.replyCount) {
                console.log('2 RP', tempTweet.replyCount, minReply.value);
                ReplyList.add(Object.assign({}, tempTweet), tempTweet.replyCount);
                ReplyList.norm();
            }
            if (tempTweet.retweetCount > minRetweet.retweetCount) {
                console.log('3 RT', tempTweet.retweetCount, minRetweet.value);
                RetweetList.add(Object.assign({}, tempTweet), tempTweet.retweetCount);
                RetweetList.norm();
            }
            if (tempTweet.favoriteCount > minFavorite.favoriteCount) {
                console.log('4 FV', tempTweet.favoriteCount, minFavorite.value);
                FavoriteList.add(Object.assign({}, tempTweet), tempTweet.favoriteCount);
                FavoriteList.norm();
            }
            if (tempTweet.quoteCount > minQuote.quoteCount) {
                console.log('5 QT');
                QuoteList.add(Object.assign({}, tempTweet), tempTweet.quoteCount);
                QuoteList.norm();
            }
            // if (tempTweet.normUrls > minUrl.normUrls) {
            //     UrlsList.add(tempTweet, 'normUrl');
            //     Tweet.message('url-list', UrlsList);
            // }
            // if (tempTweet.normHashtags > minHashtag.normHashtags) {

            // }
        }
        // stream.on('user_event', (eventMsg) => {
        //     sails.log(eventMsg);
        // });
        // stream.on('reconnect', (request, response, connectInterval) => {
        //     //...
        // });

    }

    cb();
};
