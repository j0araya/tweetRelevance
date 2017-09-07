var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var appRoot = require('app-root-path');
var requireAll = require('require-all');
var logger = require('./logger')('util:modelFragment');

module.exports = {
  /* Unfortunately Loopback does not give us a clean way of determining the
   * path in which component-config.json exists, making it difficult for us
   * to work with relative paths from that file.
   * The approach below has flaws, but it will work for the typical
   * Loopback app, including any app created with the slc generator.
   */
  divineLoopbackServerPath: function divineLoopbackServerPath() {
    var package = appRoot.require('/package.json');
    return path.dirname(appRoot.resolve(package.main));
  },

  loadModelFragments: function loadModelFragments(ModelType, sources) {
    var modelPath = _.kebabCase(ModelType.modelName);

    // Load any fragments of this model from any of the source paths
    sources.forEach(function (s) {
      module.exports.loadModelFragmentPath(ModelType, s);
    });
  },

  loadModelFragmentPath: function loadModelFragment(ModelType, fragmentPath) {
    try {
      return requireAll({
        dirname: fragmentPath,
        filter: function (fileName) {
          // console.log('compare', fileName.toLowerCase(), ' - ', ModelType.modelName.toLowerCase() + '.js');
          if (ModelType.modelName === "User") {
            return;
          } else if (fileName.toLowerCase() === ModelType.modelName.toLowerCase() + '.js') {
            return fileName;
          } else {
            return;
          }
        },
        resolve: function (fragment) {
          if (_.isFunction(fragment)) {
            logger.info(ModelType.modelName);
            return fragment(ModelType);
          }

          return fragment;
        }
      });
    } catch (err) {
      if (err.code !== 'ENOENT') {
        logger.error(err);
        throw err;
      }
    }

    return null;
  }
};
