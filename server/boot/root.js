'use strict';
var path = require('path');
var fs = require('fs');
var util = require('../utils/modelFragment');

module.exports = function (server) {
    // Install a `/` route that returns server status
    var router = server.loopback.Router();
    router.get('/status', server.loopback.status());
    server.use(router);
    var sources = [
        './api/remotes',
        '/api/defintions',
        '/api/observes',
        '/api/repositories'
    ];

    var basePath = server.get('appRootDir') || util.divineLoopbackServerPath();
    sources = sources.map(function (s) { return path.join(basePath, s); });

    server.models().forEach(function (Model) {
        util.loadModelFragments(Model, sources)
    });
    //inicio de servicios
    require('../core/email')(server);
    require('../core/ACL')(server);
};
