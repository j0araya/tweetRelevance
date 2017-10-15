// const Twitter = require("../api/modules/twStream");
const Twitter = require("twitter");
const async = require('async');

module.exports = function (app) {
    var dataSource = app.dataSources['tweet-relevance-db'];
    // FIXED: Error https://github.com/strongloop/loopback-connector/issues/98
    dataSource.setMaxListeners(0);
    dataSource.autoupdate(function (err) {
        if (err) {
            console.error('Database could not be autoupdated', err);
            return;
        }
        console.log('Database autoupdated');
    });
    // try {
    //     var User = Twitter.streaming().then(stream => {
    //         console.log(stream);
    //     });
    // } catch (e)  {
    //     console.log(e);
    // }

    var twitter = new Twitter({
        consumer_key: '41ORB4GCgUxXWNcmTLAsjpYDv',
        consumer_secret: 'QpG17l93KDlQWHKpdeNsXqLaJiZ3eeTc7BIb1CBuS9IaIctpxE',
        access_token_key: '83757941-vJvzEgz4DsOQGbuopm52BeEhvVGzcdQrWWjfGO8oF',
        access_token_secret: 'mzjDo4YV7yWxTzAcnvrbnOT0oqkLOQgz10hMPPLwzpKXx'
    });
    // console.log(twitter);

    // function streaming() {
    var stream = twitter.stream('statuses/filter', { track: 'chile' });
    stream.on('data', function (event) {
        console.log(event && event.text);
    });

    stream.on('error', function (error) {
        throw error;
    });


    // var Plan = app.models.Plan;
    // var Role = app.models.Role;
    // var RoleMapping = app.models.RoleMapping;
    // let userAdmin = {};


    /* var Client = app.models.clients;
     console.log(Client);
     Client.create({ id: "keyslideapp", clientSecret: "bU-fNC+beT^jz+g|^H24" }, function (err, client) {
       if (err) console.log(err);
     })*/
}
