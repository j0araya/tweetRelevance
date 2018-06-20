var self = module.exports = {
    pondValue: {
        quantity: 0.5,
        url: 0.3,
        hashtag: 0.2,
    },
    // normFavorite: (value) => {
    //     if (value > self.maxFavorite) {
    //         self.maxFavorite = value;
    //     }
    //     let temp = value / self.maxFavorite;
    //     return !isNaN(parseFloat(temp)) && isFinite(temp) ? temp : 0;
    // },
    // normRetweet: (value) => {
    //     if (value > self.maxRetweet) {
    //         self.maxRetweet = value;
    //     }
    //     let temp = value / self.maxRetweet;
    //     return !isNaN(parseFloat(temp)) && isFinite(temp) ? temp : 0;
    // },
    // normReply: (value) => {
    //     if (value > self.maxReply) {
    //         self.maxReply = value;
    //     }
    //     let temp = value / self.maxReply;
    //     return !isNaN(parseFloat(temp)) && isFinite(temp) ? temp : 0;
    // },
    // normQuote: (value) => {
    //     if (value > self.maxQuote) {
    //         self.maxQuote = value;
    //     }
    //     let temp = value / self.maxQuote;
    //     return !isNaN(parseFloat(temp)) && isFinite(temp) ? temp : 0;
    // },
    norm: (value, max) => {
        return value / max;
    },
    ponderate: (tweet) => {
        let sum = tweet.favoriteCount + tweet.replyCount + tweet.retweetCount + tweet.quoteCount;
        let max = self.maxFavorite + self.maxReply + self.maxRetweet + self.maxQuote;

        let plus = self.hashtagPond(tweet.entities.hashtags) + self.urlPond(tweet.entities.urls);
        let values = (sum / max) * self.pondValue.quantity;
        // console.log('plus', plus, 'sum', sum, 'max', max, 'values', values, 'pnd', self.pondValue.quantity);
        // console.log('11',tweet.favoriteCount, tweet.replyCount, tweet.retweetCount,tweet.quoteCount);
        // console.log('22', self.maxFavorite, self.maxReply, self.maxRetweet, self.maxQuote);
        values += plus;
        return values;
    },
    hashtagPond: function (hashtags) {
        return ((hashtags || []).length ? 1 : 0) * self.pondValue.hashtag;
    },
    urlPond: function (urls) {
        return ((urls || []).length ? 1 : 0) * self.pondValue.url;
    },
    getUrls: (urls) => {
        return urls.map(u => {
            return {
                url: u.url,                     // 'https://t.co/RzmrQ6wAzD'
                expandedUrl: u.expanded_url,    // 'http://bit.ly/2pUk4be'
                displayUrl: u.display_url,      // 'bit.ly/2pUk4be'
                unwound: u.unwound.url,         // 'https://blog.gnip.com/tweeting-in-the-rain/'
                status: u.unwound.status,       // 200
                title: u.unwound.title || '',
                description: u.unwound.description || ''
            };
        });
    },
    getHashtags: (hashtags) => {
        return hashtags.map(h => h.text);
    },
    isFavorited: (favorited) => {
        return favorited ? true : false;
    },
    isRetweeted: (retweeted) => {
        return retweeted ? true : false;
    }
};
