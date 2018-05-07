var maxRetweet = 0,
    maxFollowers = 0,
    maxReply = 0,
    maxFavorite = 0,
    maxQuote = 0,
    list = [],
    size = 10,
    pondValue = {
        quantity: 0.4,
        url: 0.3,
        hashtag: 0.3,
        // interval: (interval || 5) * 1000,
        substraction: 0.001,
    },
    hashtagPond = (hashtags) => {
        return ((hashtags || []).length ? 1 : 0) * pondValue.hashtag;
    },
    urlPond = (urls) => {
        return ((urls || []).length ? 1 : 0) * pondValue.url;
    };
module.exports = {
    // tweets: 0,
    pondValue: {
        quantiy: 0.5,
        url: 0.3,
        hashtag: 0.2,
    },
    list: [],
    maxRetweet: 0,
    maxFollowers: 0,
    maxReply: 0,
    maxFavorite: 0,
    maxQuote: 0,
    add: (tweet) => {
        let index = list.findIndex(l => tweet.normTotal > l.normTotal);
        let deletedValue = 0;
        console.log('aaa', list[index].id, tweet.id);
        if (list[index].id === tweet.id){
            deletedValue += 1;
        }
        if (!list.length) {
            list.push(tweet);
        } else if (list.length < size) {
            list.splice(index, deletedValue, tweet);
        } else {
            list.splice(index, deletedValue, tweet);
            list.pop();
        }
    },
    subtractMaxValues: () => {
        maxRetweet *= 0.9;
        maxFollowers *= 0.9;
        maxReply *= 0.9;
        maxFavorite *= 0.9;
        maxQuote *= 0.9;
    },
    normFavorite: (value) => {
        return value / maxFavorite;
    },
    normRetweet: (value) => {
        return value / maxRetweet;
    },
    normReply: (value) => {
        return value / maxReply;
    },
    normQuote: (value) => {
        return value / maxQuote;
    },
    ponderate: (tweet) => {
        if (tweet.favoriteCount > maxFavorite) {
            maxFavorite = tweet.favoriteCount;
        }
        if (tweet.replyCount > maxReply) {
            maxReply = tweet.replyCount;
        }
        if (tweet.retweetCount > maxRetweet) {
            maxRetweet = tweet.retweetCount;
        }
        if (tweet.quoteCount > maxQuote) {
            maxQuote = tweet.quoteCount;
        }
        let sum = tweet.favoriteCount +
            tweet.replyCount +
            tweet.retweetCount +
            tweet.quoteCount;
        let max = maxFavorite +
            maxReply +
            maxRetweet +
            maxQuote;

        let plus = hashtagPond(tweet.entities.hashtags) + urlPond(tweet.entities.urls);
        // console.log('max', max, sum);
        let values = (sum / max) * pondValue.quantity;
        values += plus;
        return values;
    },
    getMaxFollowers: () => {
        return this.maxFollowers;
    },
    getMaxRetweeted: () => {
        return this.maxRetweeted;
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