'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var express = require('express');
var oauth2 = require('loopback-component-oauth2');
var app = module.exports = loopback();
var logger = require('./utils/logger')('server');
var PassportConfigurator = require('./components/loopback-component-passport/lib').PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

var path = require('path');
logger.info('init server');



// Set up related models

app.start = function () {
    logger.init(app);
    var env = app.get('env');
    logger.info(env);
    let pathCofig = env === 'Production' ? '' : '.' + env;
    var config = {};
    try {
        config = require('./providers' + pathCofig + '.json');
    } catch (err) {
        logger.error('Please configure your passport strategy in `providers.json`.');
        process.exit(1);
    }
    passportConfigurator.init();
    passportConfigurator.setupModels({
        userModel: app.models.user,
        userIdentityModel: app.models.userIdentity,
        userCredentialModel: app.models.userCredential,
    });
    for (var s in config) {
        var c = config[s];
        c.session = c.session !== false;
        passportConfigurator.configureProvider(s, c);
    }


    var Client = loopback.getModel('OAuthClientApplication');
    Client.findOne({
        where: {
            id: "keyslideapp"
        }
    }, function (err, client) {
        if (!client) {
            Client.create({
                id: "keyslideapp",
                clientSecret: "xBxNb1WwTEx3GivW90",
                name: "keyslide web",
                tokenType: "jwt"
            }, function (err, client) {
                if (err) logger.error(err);
            })
        }
    });
    Client.findOne({
        where: {
            id: "lpe"
        }
    }, function (err, client) {
        if (!client) {
            Client.create({
                id: "lpe",
                clientSecret: "123456",
                name: "lpe",
                tokenType: "jwt",
                clientType: "confidential"
            }, function (err, client) {
                if (err) logger.error(err);
            })
        }
    });
    console.log("======EXPLORER=TOKEN======");
    console.log("id: lpe, clientSecret: 123456");
    console.log("==========================");
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    // start the web server
    return app.listen(function () {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        logger.info('Web server listening at: ' + baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            logger.info('Browse your REST API at ' + baseUrl + ' ' + explorerPath);
        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {

    if (err) {
        logger.error(err);
    };

    if (require.main === module) {
        //app.start();
        var users = 0;
        app.io = require('socket.io')(app.start());
        app.io.on('connection', function (socket) {
            users++;
            logger.info('a user connected: ' + users);
            socket.on('disconnect', function () {
                users--;
                logger.info('user disconnected: ' + users);
            });
        });
    }
});
