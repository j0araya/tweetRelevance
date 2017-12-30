/**
 * Tweet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'PostgresqlDevelop',
    attributes: {
        name: 'string',
        created_at: 'string', //fecha de creacion del tweet
        tweetId: 'integer', // id Tweet
        strTweetId: 'string', // id como string
        text: 'string', // texto del tweet
        userId: {
            model: 'user',
        },//tweet.user,

        user: 'json',
        retweetCount: 'integer',
        replyCount: 'integer',
        favoriteCount: 'integer',
        isFavorited: 'boolean', // si es favorito de una cuent autentificada
        isRetweeted: 'boolean', // si es retweteado de una cuent autentificada
        lang: 'string',
        hastags: 'array',
        urls: 'array',
    },
    afterCreate: (value, next) => {
        Tweet.message('new-tweet', value);
        next();
    }
};

