module.exports = {
    // tweets: 0,
    tweetOptions: {
        retweetMin: 20,
        url: 0.5
    },
    quantityRetweets: 0,
    maxRetweeted: 100,
    maxFollowers: 100,
    maxReply: 0,
    maxFavorite: 0,
    maxQuote: 0,
    getMaxFollowers: () => {
        return this.maxFollowers;
    },
    getMaxRetweeted: () =>  {
        return this.maxRetweeted; 
    },
    retweetedPonderation: (retweetCount) => {
        if (retweetCount > this.maxRetweeted) {
            this.maxRetweeted = retweetCount;
            return 100;
        }
        return retweetCount * 100 / this.maxRetweeted;
    },
    followersPonderation: (followersCount) => {
        if (followersCount > this.maxFollowers) {
            this.maxFollowers = followersCount;
            return 100;
        }
        return followersCount * 100 / this.maxFollowers;
    },
    replyPonderation: (replyCount) => {
        if (replyCount > this.maxReply) {
            this.maxReply = replyCount;
            return 100;
        }
        return replyCount * 100 / this.maxReply;
    },
    favoritePonderation: (favoriteCount) => {
         if (favoriteCount > this.maxFavorite) {
            this.maxFavorite = favoriteCount;
            return 100;
        }
        return favoriteCount * 100 / this.maxFavorite;
    },
    quotePonderation: (quoteCount) => {
        if (quoteCount > this.maxQuote) {
            this.maxQuote = quoteCount;
            return 100;
        }
        return quoteCount * 100 / this.maxQuote;
    },
    urlPonderation: (urls) => {
        return Array.isArray(urls) ? 100 : 0;
    },
    getUrls: (urls) => {
        return urls.map(u =>  {
            return { 
                url: u.url,                     // 'https://t.co/RzmrQ6wAzD'
                expandedUrl: u.expanded_url,    // 'http://bit.ly/2pUk4be'
                displayUrl: u.display_url,      // 'bit.ly/2pUk4be'
                unwound: u.unwound.url,         // 'https://blog.gnip.com/tweeting-in-the-rain/'
                status: u.unwound.status,       // 200
                title: u.unwound.title || '',
                description: u.unwound.description || ''
            }
        });
    },
    hashtagsPonderation: (hashtags) => {
        return Array.isArray(hashtags) ? 100 : 0;
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

}