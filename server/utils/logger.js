var winston = require('winston');
var moment = require('moment');

module.exports = function (moduleName) {
  var debugError = require('debug')('keyslide:' + moduleName + ':error');
  var debugWarm = require('debug')('keyslide:' + moduleName + ':warm');
  var debugLog = require('debug')('keyslide:' + moduleName + ':log');
  var debugInfo = require('debug')('keyslide:' + moduleName + ':info');

  var module = {
    error: error,
    warn: warn,
    log: log,
    info: info,
    init: init
  }

  function init(app) {
    winston.remove(winston.transports.Console);
    var config = app.get('logger');
    if (config.console !== undefined && config.console.enable) {
      if (config.console.options === undefined) {
        winston.add(winston.transports.Console)
      } else {
        winston.add(winston.transports.Console, config.console.options)

      }
    }
    if (config.file !== undefined && config.file.enable) {
      if (config.file.options === undefined) {
        winston.add(winston.transports.File)
      } else {
        winston.add(winston.transports.File, config.file.options)

      }
    }
    if (config.mongodb !== undefined && config.mongodb.enable) {
      var MongoDB = require('winston-mongodb').MongoDB;
      if (config.mongodb.options !== undefined) {
        winston.add(MongoDB, config.mongodb.options);
      }
    }
    if (config.sentry !== undefined && config.sentry.enable) {
      var Sentry = require('winston-sentry');
      if (config.sentry.options !== undefined) {
        winston.add(new Sentry({
          dsn: config.sentry.options.dsn
        }));

      }
    }
  }

  function error() {
    winston.error(moment().format('DD-MM-YYYY HH:mm:ss'), 'wenteract:' + moduleName, ...arguments);
    //  debugError(err);
  }

  function info() {
    winston.info(moment().format('DD-MM-YYYY HH:mm:ss'), 'wenteract:' + moduleName, ...arguments);
    //  debugInfo(msg);
  }

  function log() {
    winston.log(moment().format('DD-MM-YYYY HH:mm:ss'), 'wenteract:' + moduleName, ...arguments);
    // debugLog(msg);
  }

  function warn() {
    winston.warn(moment().format('DD-MM-YYYY HH:mm:ss'), 'wenteract:' + moduleName, ...arguments);
    // debugWarm(msg);
  }

  return module;
}
