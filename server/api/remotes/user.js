// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const path = require('path');
const stripe = require('../modules/stripe');
const storageS3 = require('../modules/storageS3');
const logger = require('../../utils/logger')('controller:user');
const app = require('../../server');
const Role = app.models.Role;
const RoleMapping = app.models.RoleMapping;
/**
 * @param {Loopback.ModelConstructor} User
 * @return {Loopback.ModelConstructor}
 */
module.exports = function (User) {
    /*User.beforeRemote('**', function (ctx, user, next, req) {
        logger.info(ctx.methodString, 'was beforeRemote remotely');
        next();
    });*/
    User.beforeRemote('find', (ctx, Project, next) => {

        if (!ctx.req.user.admin && ctx.args.filter && ctx.args.filter.where && ctx.args.filter.where.email) {
            let email = ctx.args.filter.where.email;
            ctx.args.filter = {
                where: {
                    email: email
                },
                fields: {
                    id: true,
                    email: true,
                    name: true
                }
            }
        }
        next();
    })
    //GET:api/users/me
    User.remoteMethod('me', {
        'accepts': [{
            arg: 'user',
            type: 'object',
            http: ctx => ctx.req.user,
        }],
        'returns': [{
            "arg": "user",
            "type": "object",
            "root": true,
            "description": "usuario logeado"
        }],
        "description": "informacion del usuario logeado",
        "http": [{
            "path": "/me",
            "verb": "get"
        }]
    });
    User.me = function (user, callback) {
        return User.findById(user.id, {
            include: [{
                relation: 'stripe'
            }, {
                relation: 'plan'
            }, {
                relation: 'teams',
                scope: {
                    include: 'team'
                }
            }]
        }).then(user => {
            return user;
        }).catch(err => {
            logger.error(err);
            throw err;
        });

    };
    //GET:api/users/me
    User.mePath = function (req, callback) {
        let bypass = false;
        if (req._body) {
            bypass = true;
        }
        return storageS3.uploadParseReq(req, bypass)
            .then(result => {
                if (bypass) {
                    return {
                        fields: req.body
                    };
                } else {
                    return result;
                }
            })
            .then(result => {
                if (result.files === undefined || result.files.file === undefined) {
                    return result;
                } else {
                    if (storageS3.validateFiles(result.files, 'image')) {
                        result.existFile = true;
                        return result;
                    } else {
                        return result;
                    }
                }
            })
            .then(result => {
                if (result.existFile === undefined) {
                    return result;
                } else {
                    return storageS3.removeFile(req.user.avatar.keyAmazon)
                        .then(file => {
                            return result;
                        }).catch(err => {
                            logger.error(err);
                            throw err;
                        });
                }
            })
            .then(result => {
                if (result.existFile === undefined) {
                    delete result.fields.avatar;
                    return result;
                } else {
                    return storageS3.uploadFiles('profile', result.files)
                        .then(file => {
                            result.fields.avatar = {
                                src: file.location,
                                keyAmazon: file.name
                            };
                            return result;
                        }).catch(err => {
                            logger.error(err);
                            throw err;
                        });
                }
            })
            .then(result => {
                delete result.fields.plan;
                delete result.fields.email;
                delete result.fields.status;
                delete result.fields.access_token;
                delete result.fields.quotaUsed;
                return req.user.updateAttributes(result.fields)
                    .then(res => {
                        return res;
                    }).catch(err => {
                        logger.error(err);
                        throw err;
                    });

            }).catch(err => {
                logger.error(err);
                throw err;
            });
    }
    //GET:api/users/activate/:token
    User.activate = function (token, callback) {
        return User.findOne({
                where: {
                    activateToken: token,
                    activateExpires: {
                        gt: Date.now()
                    }
                }
            })
            .then(user => {
                if (!user) {
                    let err = new Error("User Token expired or invalid.");
                    err.statusCode = 401;
                    err.code = 'USER_ACTIVATE_TOKEN_EXPIRED_INVALID';
                    throw err;
                }
                return user.updateAttribute('activateExpires', Date.now() - 1000)
                    .then(res => {
                        return Role.findOne({
                            name: 'userNotActivated'
                        }).then(role => {
                            return RoleMapping.destroyAll({
                                principalId: user.id,
                                roleId: role.id
                            }).then(res => {
                                return res;
                            }).catch(err => {
                                throw err;
                            });
                        }).catch(err => {
                            throw err;
                        });
                    }).then(res => {
                        return Role.findOne({
                            name: 'userActivated'
                        }).then(role => {
                            return role.principals.create({
                                principalType: RoleMapping.USER,
                                principalId: user.id
                            }).then(principal => {
                                return {};
                            }).catch(err => {
                                throw err;
                            });

                        }).catch(err => {
                            throw err;
                        });
                    })
                    .catch(err => {
                        throw err;
                    });
            }).catch(err => {
                logger.error(err);
                throw err;
            });
    }
    //GET:api/users/reset/:email
    User.reset = function (email, callback) {
        return User.findOne({
                where: {
                    email: email,
                    status: {
                        neq: "banned"
                    }
                }
            })
            .then(user => {
                if (user) {
                    return User.sendResetPassword(user)
                        .then(res => {
                            return {};
                        }).catch(err => {
                            throw err;
                        });
                } else {
                    let err = new Error("That user is invalid or has been banned.");
                    err.statusCode = 403;
                    err.code = 'USER_RESET_BANNED_INVALID';
                    throw err;
                }
            })
            .catch(err => {
                throw err;
            });

    }
    //POST:api/users/reset/:email
    User.resetPassword = function (password, token, email, callback) {
        return User.findOne({
                where: {
                    email: email,
                    resetPasswordToken: token,
                    resetPasswordExpires: {
                        gt: Date.now()
                    }
                }
            })
            .then(user => {
                if (user) {
                    return user.updateAttributes({
                        resetPasswordExpires: Date.now() - 86400000,
                        password: password,
                        status: "active"
                    }).then(res => {
                        return {};
                    }).catch(err => {
                        throw err;
                    });
                } else {
                    let err = new Error("User Token expired or invalid.");
                    err.statusCode = 403;
                    err.code = 'USER_RESET_TOKEN_INVALID_EXPIRED';
                    throw err;
                }
            })
            .catch(err => {
                throw err;
            });
    }
    //si hay algun error al ejecutar create en el remoto
    User.afterRemoteError('create', (ctx, next) => {
        logger.error('afterRemoteError Create User', ctx.args.data);
        if (ctx.args.data.avatar !== undefined && ctx.args.data.avatar.keyAmazon !== undefined) {

        }
        next();
    })
    //antes de crear
    User.beforeRemote('create', (ctx, user, next) => {
        let bypass = false;
        if (ctx.req._body) {
            bypass = true;
        }
        return storageS3.uploadParseReq(ctx.req, bypass)
            .then(result => {
                if (bypass) {
                    return {
                        fields: ctx.args.data
                    };
                } else {
                    return result;
                }
            })
            .then(result => {
                if (ctx.req.user === undefined || ctx.req.user.admin === false) {
                    delete result.fields.plan;
                    delete result.fields.planId;
                    delete result.fields.bypassStripe;
                }
                ctx.args.data = result.fields;
                return result;
            })
            .then(result => {
                if (result.files === undefined || result.files.file === undefined) {
                    return result;
                } else {
                    if (storageS3.validateFiles(result.files, 'image')) {
                        return result;
                    } else {
                        throw new Error("The format in file is invalid");
                    }
                }
            })
            .then(result => {
                if (result.files === undefined || result.files.file === undefined) {
                    return result;
                } else {
                    return storageS3.uploadFiles('profile', result.files)
                        .then(file => {
                            ctx.args.data.avatar = {
                                src: file.location,
                                keyAmazon: file.name
                            };
                            return result;
                        }).catch(err => {
                            logger.error(err);
                            throw err;
                        });
                }
            })
            .catch(err => {
                logger.error(err);
                throw err;
            });
    });

    User.createOptionsFromRemotingContext = (ctx) => {
        var base = User.base.createOptionsFromRemotingContext(ctx);
        base.currentUser = ctx.req.user;
        return base;
    };

};
