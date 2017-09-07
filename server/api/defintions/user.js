// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var logger = require('../../utils/logger')('validations:user');
var app = require('../../server');
/**
 * @param {Loopback.ModelConstructor} User
 * @return {Loopback.ModelConstructor}
 */
module.exports = function (User) {
    User.validatesPresenceOf('planId');
    User.validatesPresenceOf('plan');
};