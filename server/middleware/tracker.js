const colors = require('colors');
var logger = require('../utils/logger')('tracker');
module.exports = function () {
    return function tracker(req, res, next) {
        // console.log('Request tracking middleware triggered on %s', req.url);
        var start = process.hrtime();
        res.once('finish', function () {
            var status = res.statusCode;
            switch (status) {
                case 200:
                case 201:
                case 204:
                case 302:
                case 304:
                    colors.setTheme({ show: 'green' });
                    break;
                default:
                    colors.setTheme({ show: 'red' });
                    break;
            }
            var statusMessage = res.statusMessage;
            var diff = process.hrtime(start);
            var ms = diff[0] * 1e3 + diff[1] * 1e-6;
            logger.info(req.method + ':' + req.originalUrl + ' ' + colors.show(status + ' ' + statusMessage) + ' ' + ms + ' ms');
        });
        next();
    };
};