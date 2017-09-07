// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const _ = require('lodash');
const path = require('path');
const loopback = require('loopback');
const algolia = require('../modules/algolia');
const async = require('async');
const logger = require('../../utils/logger')('observes:user');
const util = require('../../utils/global');
const app = require('../../server');
const ValidationRelations = require('../modules/ValidationRelations');
const storageS3 = require('../modules/storageS3');
const stripe = require('../modules/stripe');
const uuidv4 = require('uuid/v4');
const Channel = app.models.Channel;
var Promise = require("bluebird");
/**
 * @param {Loopback.ModelConstructor} User
 * @return {Loopback.ModelConstructor}
 */
module.exports = function (User) {
    User.observe('before save', function (ctx, next) {
        let data = ctx.instance;
        if (ctx.isNewInstance) {
            return Promise.resolve()
                .then(() => {
                    delete data.confirmPassword;
                    delete data.stripe;
                    delete data.quotaUsed;
                    delete data.notifications;
                    delete data.projects;
                    if (ctx.options.currentUser === undefined || ctx.options.currentUser.admin === undefined || ctx.options.currentUser.admin === false) {
                        delete data.bypassStripe;
                    }
                    return null;
                })
                .then(() => {
                    //se agrega un password falso si no se a enviado password
                    if (data.password === undefined) {
                        data.password = uuidv4();
                    }
                    return null;
                })
                .then(() => {
                    //se agrega un plan por defecto si no se ha enviado
                    if (data.planId === undefined) {
                        var Plan = app.models.Plan;
                        return Plan.findOne({
                                where: {
                                    codeName: "ksd-bronze"
                                }
                            })
                            .then(plan => {
                                //  result.fields.plan = plan.toObject();
                                data.planId = plan.id;
                                data.plan = plan;
                                return plan;
                            }).catch(err => {
                                throw err;
                            })
                    } else {
                        return null;
                    }
                })
                .then(() => {
                    //validacion de relaciones
                    return ValidationRelations.validate(User, data)
                        .then(() => {
                            return null;
                        }).catch(err => {
                            throw err;
                        })
                })
                .catch(err => {
                    logger.error(err);
                    throw err;
                });
        } else {
            if (ctx.data && ctx.data.bypassStripe && ctx.options.currentUser !== undefined && (ctx.options.currentUser.admin === undefined || ctx.options.currentUser.admin === false)) {
                delete ctx.data.bypassStripe;
            }
            if (ctx.currentInstance) {
                ctx.options.current = ctx.currentInstance.toObject();
            }
            next();
        }
    });
    User.observe('persist', function (ctx, next) {
        let data = ctx.currentInstance;
        if ((ctx.isNewInstance || ctx.data.tokenCreditCard || (ctx.data.planId && ctx.options.current)) && !ctx.options.bypassPlan) {
            return stripe.observate(ctx)
                .then(respStripe => {
                    return respStripe;
                }).catch(err => {
                    throw err;
                });
        } else {
            next();
        }
    });
    User.observe('after save', (ctx, next) => {
        //FIXME: parche solucion si hay error en persist
        if (ctx.options.error) {
            next(ctx.options.error);
            return;
        }
        if (ctx.options.stripe && ctx.isNewInstance) {
            ctx.instance.stripe.create(ctx.options.stripe)
                .then(() => {
                    //nada
                }).catch(err => {
                    logger.error(err);
                });
        }
        if (ctx.isNewInstance) {
            let data = ctx.instance;
            Channel.createDefaultForUser(data.id)
                .then(res => {
                    //nada
                }).catch(err => {
                    logger.error(err);
                });

            let nameRole = data.admin ? 'admin' : 'userNotActivated';
            var Role = app.models.Role;
            var RoleMapping = app.models.RoleMapping;
            Role.findOne({
                where: {
                    name: nameRole
                }
            }, function (err, role) {
                if (err) return logger.error(err);
                if (role) {
                    role.principals.create({
                        principalType: RoleMapping.USER,
                        principalId: data.id
                    }, function (err, principal) {
                        if (err) return logger.error(err);
                    })
                } else {
                    logger.warn('The role: ' + nameRole + ' not exists');
                }
            })
            if (data.admin) {
                next();
            } else if (ctx.options.resetPassword) {
                return User.sendResetPassword(data)
                    .then(res => {
                        return res;
                    }).catch(err => {
                        throw err;
                    });
            } else {
                if (data.beta) {
                    User.sendBetaActivate(data)
                        .then(res => {
                            next();
                        }).catch(err => {
                            next(err);
                        });
                } else {
                    User.sendActivate(data)
                        .then(res => {
                            next();
                        }).catch(err => {
                            next(err);
                        });
                }
            }
        } else {
            next();
        }
    })
    User.observe('before delete', function (ctx, next) {
        User.find({
            where: ctx.where
        }, (err, result) => {
            if (err) return next(err);
            let resultArray = [];
            if (Array.isArray(result)) {
                resultArray = result;
            } else if (result) {
                resultArray.push(result);
            } else {
                next();
                return
            }
            for (let i = 0; resultArray.length > i; i++) {
                let obj = resultArray[i];
                if (obj.avatar !== undefined && obj.avatar.keyAmazon !== undefined) {
                    storageS3.removeFile(obj.avatar.keyAmazon).then(() => {
                        //nada
                    }).catch(err => {
                        logger.warn(err);
                    });
                }
                if (obj.bypassStripe === false || obj.bypassStripe === undefined) {
                    stripe.removeSubscription(obj.stripe.idSubscription)
                        .then(res => {
                            //nada
                        }).catch(err => {
                            logger.warn(err);
                        });
                } else {

                }
            }
            next();
        })
    });
};
