class Tweet {
    constructor(tweet) {
        this.retweets = tweet.retweets;
        this.replies = tweet.replies;
        this.comments = tweet.comments;
        this.favoriteCount = favoriteCount;
        this.val = tweet.retweets + tweet.replies + tweet.comments;
        return this;
    }
}

TweetList.prototype.getFirst = function () {
    return this.list[0];
};

module.exports.Tweet = Tweet;