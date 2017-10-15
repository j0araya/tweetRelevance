'use strict';
const _ = require("lodash");
const app = require('../../server');
const twit = require("twitter");
const util = require('util');

var mod = {
    twitter,
    streaming,
};

// TWITTER_CONSUMER_KEY: '41ORB4GCgUxXWNcmTLAsjpYDv',
// TWITTER_CONSUMER_SECRET: 'QpG17l93KDlQWHKpdeNsXqLaJiZ3eeTc7BIb1CBuS9IaIctpxE',

// TWITTER_TOKEN_KEY: '83757941-vJvzEgz4DsOQGbuopm52BeEhvVGzcdQrWWjfGO8oF',
// TWITTER_TOKEN_SECRET: 'mzjDo4YV7yWxTzAcnvrbnOT0oqkLOQgz10hMPPLwzpKXx',

var twitter = new twit({
    consumer_key: '41ORB4GCgUxXWNcmTLAsjpYDv',
    consumer_secret: 'QpG17l93KDlQWHKpdeNsXqLaJiZ3eeTc7BIb1CBuS9IaIctpxE',
    access_token_key: '83757941-vJvzEgz4DsOQGbuopm52BeEhvVGzcdQrWWjfGO8oF',
    access_token_secret: 'mzjDo4YV7yWxTzAcnvrbnOT0oqkLOQgz10hMPPLwzpKXx'
});


function streaming() {
    return twitter.stream('filter', { track: 'chile' }, stream => {
        return stream.on('data', data => {
            console.log(util.inspect(data));
            stream.destroy();
            process.exit(0);
        });
    });
}


console.log('twitter', twitter)

module.exports = mod;