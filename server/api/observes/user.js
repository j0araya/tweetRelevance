// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const _ = require('lodash');
const path = require('path');
const loopback = require('loopback');
const async = require('async');
const logger = require('../../utils/logger')('observes:user');
const util = require('../../utils/global');
const app = require('../../server');
const ValidationRelations = require('../modules/ValidationRelations');
const storageS3 = require('../modules/storageS3');
const stripe = require('../modules/stripe');
const uuidv4 = require('uuid/v4');
var Promise = require("bluebird");
/**
 * @param {Loopback.ModelConstructor} User
 * @return {Loopback.ModelConstructor}
 */
module.exports = function (User) {};
