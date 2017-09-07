// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const path = require('path');
const loopback = require('loopback');
const stripe = require('../modules/stripe');
const async = require('async');
const logger = require('../../utils/logger')('repositories:user');
const util = require('../../utils/global');
const app = require('../../server');
const ValidationRelations = require('../modules/ValidationRelations');
const crypto = require('crypto');
/**
 * @param {Loopback.ModelConstructor} User
 * @return {Loopback.ModelConstructor}
 */
module.exports = function (User) {

    /**
    * @param {Loopback.ModelConstructor} user
    * @return {Loopback.ModelConstructor}
    */
    User.sendActivate = (user) => {
        return util.createToken()
            .then(token => {
                return user.updateAttributes({
                    activateExpires: Date.now() + 86400000,
                    activateToken: token
                }).then(res => {
                    let template = 'userActivate.ejs';
                    let subject = 'Keyslide - Activate your Account';
                    let href = User.app.get('hostClient') + "/account/activate/" + token;
                    let data = {
                        user: user.name ? user.name : user.email,
                        href: href
                    }
                    app.email.send(user.email, subject, template, data);
                }).catch(err => {
                    throw err;
                });
            }).catch(err => {
                throw err;
            });
    }
    /**
    * @param {Loopback.ModelConstructor} user
    * @return {Loopback.ModelConstructor}
    */
    User.sendBetaActivate = (user) => {
        return util.createToken()
            .then(token => {
                return user.updateAttributes({
                    resetPasswordExpires: Date.now() + 86400000,
                    resetPasswordToken: token
                }).then(res => {
                    let template = 'userActivateBeta.ejs';
                    let subject = 'Keyslide (Beta) is here, and you\'ve been accepted!';
                    let href = User.app.get('hostClient') + "/account/reset/" + token;
                    let data = {
                        user: user.name ? user.name : user.email,
                        href: href
                    }
                    app.email.send(user.email, subject, template, data);
                }).catch(err => {
                    throw err;
                });
            }).catch(err => {
                throw err;
            });
    }
    /**
     * @param {Loopback.ModelConstructor} user
     * @return {Loopback.ModelConstructor}
     */
    User.sendResetPassword = (user) => {
        return util.createToken()
            .then(token => {
                return user.updateAttributes({
                    resetPasswordExpires: Date.now() + 86400000,
                    resetPasswordToken: token
                }).then(res => {
                    let template = 'userReset.ejs';
                    let subject = 'Keyslide - Password Reset';
                    let href = User.app.get('hostClient') + "/account/reset/" + token;
                    let data = {
                        user: user.name ? user.name : user.email,
                        href: href
                    }
                    app.email.send(user.email, subject, template, data);
                }).catch(err => {
                    throw err;
                });
            }).catch(err => {
                throw err;
            });
    }
    User.checkCapacityAndDiscountQuota = (user, project = 0, storage = 0, cb) => {
        cb = cb || util.createPromiseCallback();
        try {
            let currentUserObj = user.toJSON();
            currentUserObj.quotaUsed.projects = currentUserObj.quotaUsed.projects + project;
            currentUserObj.quotaUsed.storage = currentUserObj.quotaUsed.storage + storage;
            if (currentUserObj.quotaUsed.storage > currentUserObj.plan.quota.storage || (currentUserObj.quotaUsed.projects > currentUserObj.plan.quota.projects && currentUserObj.plan.quota.projects !== 0)) {
                var err = new Error("You have exceeded the maximum number of storage or projects in your plan.");
                err.statusCode = 401;
                cb(err);
            } else {
                user.updateAttributes({ quotaUsed: currentUserObj.quotaUsed }, (err, res) => {
                    if (err) {
                        cb(err);
                        return;
                    }
                    cb();
                });

            }
        } catch (e) {
            cb(e);
        }
        if (cb.promise) {
            return cb.promise;
        }
    }
    User.addQuota = (user, project = 0, storage = 0, cb) => {
        cb = cb || util.createPromiseCallback();
        try {
            let currentUserObj = user.toJSON();
            currentUserObj.quotaUsed.projects = currentUserObj.quotaUsed.projects - project;
            currentUserObj.quotaUsed.storage = currentUserObj.quotaUsed.storage - storage;
            if (currentUserObj.quotaUsed.projects < 0) {
                currentUserObj.quotaUsed.projects = 0;
            }
            if (currentUserObj.quotaUsed.storage < 0) {
                currentUserObj.quotaUsed.storage = 0;
            }
            user.updateAttributes({ quotaUsed: currentUserObj.quotaUsed }, (err, res) => {
                if (err) {
                    cb(err);
                    return;
                }
                cb();
            });
        } catch (e) {
            cb(e);
        }
        if (cb.promise) {
            return cb.promise;
        }
    }
    /*
    User.observe('deleteById', (ctx, next) => {

        return User.findById(ctx.args.id).then(user => {
            if (user) {
                if (user.stripe && user.stripe.id) {
                    return stripe.removeCustomer(user.stripe.id).then(() => {
                        return user;
                    }).catch(err => {
                        logger.error(err);
                        throw err;
                    })
                } else {
                    return user;
                }
            } else {
                return user;
            }
        }).catch(err => {
            logger.error(err);
            throw err;
        });

    });
    */
};