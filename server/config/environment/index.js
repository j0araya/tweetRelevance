'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,
    instances: 1,
    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 3000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Should we populate the DB with sample data?
    seedDB: true,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'keyslide-secret',
        sharedProject: '@8x^UxjX7aeJpir1%BkY8tTR*iNgc5xBGW&YFQVd32YJWCyy03Aq39FnH5sFLBElr4'
    },
    token: {
        expiresIn: 86400,
        calculateExpirationDate: function () {
            return new Date(new Date().getTime() + (this.expiresIn * 1000));
        },
        authorizationCodeLength: 16,
        accessTokenLength: 256,
        refreshTokenLength: 256
    },
    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    facebook: {
        clientID: process.env.FACEBOOK_ID || 'id',
        clientSecret: process.env.FACEBOOK_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/api/v1/auth/facebook/callback'
    },

    twitter: {
        clientID: process.env.TWITTER_ID || 'id',
        clientSecret: process.env.TWITTER_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/api/v1/auth/twitter/callback'
    },

    google: {
        clientID: process.env.GOOGLE_ID || 'id',
        clientSecret: process.env.GOOGLE_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/api/v1/auth/google/callback'
    },
    mail: {
        user: process.env.MAILUSER || 'user',
        password: process.env.MAILPASS || 'pass',
        service: process.env.MAILSERVICE || 'service',
        host: process.env.MAILHOST || 'host',
        from: process.env.MAILFROM || 'from'
    },
    algolia: {
        applicationID: process.env.ALGOLIAAPPLICATIONID || 'applicationID',
        APIKEY: process.env.ALGOLIAAPIKEY || 'APIKEY',
    },
    amazonS3: {
        bucket: process.env.BUCKETS3 || 'BUCKETS3',
    },
    stripe: {
        key: process.env.KEYSTRIPE || 'KEYSTRIPE',
    },
    url: {
        client: process.env.URLCLIENT || 'URLCLIENT',
    },
    theNoun: {
        key: 'b1e7ccfbf2a54cd3abedc5cccf7ccb92',
        secret: '4f228dd5f9284a4d9752c3fdd12022da'
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') || {});
