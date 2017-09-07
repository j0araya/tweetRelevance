// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const path = require('path');
const loopback = require('loopback');
const async = require('async');
const logger = require('../../utils/logger')('repositories:accessToken');
const util = require('../../utils/global');
const app = require('../../server');
const oAuthTokenModel = app.models.oAuthTokenModel;
const crypto = require('crypto');
const jwt = require('jws');
const uid = require('uid2');
/**
 * @param {Loopback.ModelConstructor} AccessToken
 * @return {Loopback.ModelConstructor}
 */
module.exports = function (AccessToken) {
    AccessToken.create = (data, options, cb) => {
        if (cb === undefined && typeof options === 'function') {
            // createAccessToken(ttl, cb)
            cb = options;
            options = undefined;
        }

        cb = cb || util.createPromiseCallback();
        let ttl = 14 * 24 * 3600;
        let OAuthAccessToken = loopback.getModel('OAuthAccessToken');
        let User = app.models.user;
        User.findById(data.userId, (err, user) => {
            var id = uid(32);
            var payload = {
                id: id,
                userId: user && user.id,
                createdAt: new Date(),
            };
            var body = {
                header: { alg: 'HS256' },
                payload: payload,
                secret: id
            };
            let refreshtoken = jwt.sign(body);
            OAuthAccessToken.create({
                id: refreshtoken,
                ttl: ttl,
                userId: user.id,
                refreshToken: refreshtoken,
                scopes: ["DEFAULT"]
            }, cb);
        })

        return cb.promise;
    }
};