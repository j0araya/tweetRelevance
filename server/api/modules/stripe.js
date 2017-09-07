'use strict';
var _ = require("lodash");
var app = require('../../server');
var Promise = require("bluebird");
var logger = require('../../utils/logger')('api:modules:stripe');
var stripe = require("stripe")(
    app.get('stripe').key
);
var enable = app.get('stripe').enable;
if (app.get('stripe').enable === undefined) {
    enable = false;
}
Promise.promisifyAll(stripe);
var mod = {
    addPlan: addPlan,
    removePlan: removePlan,
    addCustomer: addCustomer,
    updateCustomer: updateCustomer,
    removeCustomer: removeCustomer,
    addSubscription: addSubscription,
    updateSubscription: updateSubscription,
    removeSubscription: removeSubscription,
    checkEvent: checkEvent,
    addCoupon: addCoupon,
    removeCoupon: removeCoupon,
    getCreditCards: getCreditCards,
    addCreditCard: addCreditCard,
    removeCreditCard: removeCreditCard,
    observate: observate
}
/**
 * @description funcion que inserta o actualiza en un modelo que dependa del modelo stripe, tarjeta de credito, plan,
 * customer y subcripcion (este esta preparado para observate en phase persistent)
 * @param  {Object} ctx
 */
function observate(ctx) {
    let data = ctx.currentInstance;
    let dataStripe = {};
    return Promise.resolve()
        .then(() => {
            if (ctx.isNewInstance === false) {
                return ctx.currentInstance.stripe.get()
                    .then(data => {
                        dataStripe = data;
                        return data;
                    }).catch(err => {
                        throw err;
                    })
            } else {
                return null;
            }
        })
        .then(() => {
            //agregado de customer stripe
            if (dataStripe.idStripe === undefined && (data.bypassStripe === undefined || data.bypassStripe === false)) {
                return addCustomer(data).then(resp => {
                    if (resp !== undefined) {
                        dataStripe.idStripe = resp;
                        return null;
                    } else {
                        return null;
                    }
                }).catch(err => {
                    throw err;
                })
            } else {
                return null;
            }
        })
        .then(() => {
            //eliminacion de tarjeta de credito si es cambiada stripe
            if (data.tokenCreditCard !== undefined && dataStripe.isAddedCreditCard === true && ctx.isNewInstance === false && (data.bypassStripe === undefined || data.bypassStripe === false) && (dataStripe === undefined || dataStripe.idStripe === undefined) === false) {
                return getCreditCards(dataStripe.idStripe)
                    .then(cards => {
                        if (cards.data.length === 0) {
                            return null;
                        }
                        for (let i = 0; cards.data.length > i; i++) {
                            return removeCreditCard(dataStripe.idStripe, cards.data[i].id)
                                .then(() => {
                                    //nada
                                    if (i === cards.data.length - 1) {
                                        dataStripe.isAddedCreditCard = false;
                                        return null;
                                    }
                                }).catch(err => {
                                    throw err;
                                })
                        }
                    }).catch(err => {
                        throw err;
                    })
            } else {
                return null;
            }
        })
        .then(() => {
            //agregado de tarjeta de credito stripe
            if (dataStripe && !dataStripe.isAddedCreditCard && (data.bypassStripe === undefined || data.bypassStripe === false) && data.tokenCreditCard !== undefined) {
                return addCreditCard(dataStripe.idStripe, data.tokenCreditCard)
                    .then(res => {
                        dataStripe.isAddedCreditCard = true;
                        if (dataStripe.save) {
                            dataStripe.save();
                        }
                        return null;
                    }).catch(err => {
                        throw err;
                    })
            } else {
                return null;
            }
        })
        .then(() => {
            //cambio de plan
            let quantity = 1;
            let changeQuantity = false;
            if (data.quota && data.quota.members) {
                quantity = data.quota.members;
                changeQuantity = true;
            }
            if (ctx.isNewInstance === false && (dataStripe === undefined || dataStripe.idSubscription === undefined || dataStripe.idSubscription === null) === false && (data.bypassStripe === undefined || data.bypassStripe === false) && (data.planId.toString() !== ctx.options.current.planId.toString() || (changeQuantity && (ctx.options.current.quota.members !== quantity)))) {
                return data.plan.get().then(plan => {
                    return updateSubscription(dataStripe.idSubscription, plan.codeName, quantity).then(resp => {
                        return null;
                    }).catch(err => {
                        dataStripe.idSubscription = null;
                        if (err.message.includes("No such subscription")) {
                            return null;
                        } else {
                            throw err;
                        }
                    })
                }).catch(err => {
                    throw err;
                })
            } else {
                return null;
            }
        })
        .then(() => {
            //agregado de subcripcion stripe
            if ((dataStripe === undefined || dataStripe.idSubscription === undefined || dataStripe.idSubscription === null) && (data.bypassStripe === undefined || data.bypassStripe === false)) {
                return data.plan.get().then(plan => {
                    let quantity = 1;
                    if (data.quota && data.quota.members) {
                        quantity = data.quota.members;
                    }
                    return addSubscription(plan.codeName, dataStripe.idStripe, data.coupon, quantity).then(resp => {
                        dataStripe.idSubscription = resp;
                        return null;
                    }).catch(err => {
                        throw err;
                    })

                }).catch(err => {
                    throw err;
                })

            } else {
                //se previene cambio de plan si no esta stripe
                if (ctx.isNewInstance === false && (data.bypassStripe === undefined || data.bypassStripe === false)) {
                    delete ctx.data.planId;
                }
                return null;
            }
        })
        .then(() => {
            ctx.options.stripe = dataStripe;
            return null;
        })
        .catch(err => {
            logger.error(err);
            delete ctx.data.planId;
            ctx.options.error = err;
            throw err;
        });
}
//seccion tarjeta de credito
function getCreditCards(idSubcription) {
    if (enable) {
        return stripe.customers.listCards(idSubcription)
            .then(cards => {
                return cards;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            });
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}

function removeCreditCard(idCustomer, idCreditCard) {
    if (enable) {
        return stripe.customers.deleteCard(idCustomer, idCreditCard)
            .then(response => {
                return response;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}

function addCreditCard(idCustomer, sourceCard) {
    if (enable) {
        return stripe.customers.createSource(idCustomer, {
                source: sourceCard
            })
            .then(response => {
                return response;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}
//fin seccion tarjeta de credito
//seccion plan
function addPlan(entity) {
    if (enable) {
        return stripe.plans.create({
                name: entity.name,
                id: entity.codeName,
                interval: entity.interval,
                currency: "usd",
                amount: entity.cost * 100,
            })
            .then(() => {
                return entity;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}

function removePlan(idPlan) {
    if (enable) {
        return stripe.plans.del(idPlan)
            .then(() => {
                return idPlan;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}
//fin seccion plan
//seccion customer
function addCustomer(entity) {
    if (enable) {
        return stripe.customers.create({
                email: entity.email,
                description: entity.name,
                card: entity.source
            })
            .then(resp => {
                return resp.id;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}

function updateCustomer(entity) {
    if (enable) {
        var id = entity.stripe.id;
        if (id) {
            return stripe.customers.update(id, {
                    email: entity.email,
                    description: entity.name,
                    card: entity.source,
                })
                .then(() => {
                    return entity;
                })
                .catch(err => {
                    logger.error(err);
                    throw err;
                })
        } else {
            return addCustomer(entity);
        }
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }

}

function removeCustomer(id) {
    if (enable) {
        return stripe.customers.del(id)
            .then(() => {
                return id;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }

}
//fin seccion customer
//seccion subcriptions
function addSubscription(codeNamePlan, idStripe, coupon, quantity = 1) {
    if (enable) {
        return stripe.subscriptions.create({
                customer: idStripe,
                items: [{
                    plan: codeNamePlan,
                    quantity: quantity
                }],
                coupon: coupon
            })
            .then(resp => {
                return resp.id;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })

    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}

function updateSubscription(idSubcription, planCodename, quantity = 1) {
    if (enable) {
        return stripe.subscriptions.retrieve(idSubcription)
            .then(res => {
                var item_id = res.items.data[0].id;

                return stripe.subscriptions.update(idSubcription, {
                        items: [{
                            id: item_id,
                            plan: planCodename,
                            quantity: quantity
                        }],
                    })
                    .then((res) => {
                        return res;
                    })
                    .catch(err => {
                        logger.error(err);
                        throw err;
                    })

            }).catch(err => {
                logger.error(err);
                throw err;
            })

    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}

function removeSubscription(idSubscription) {
    if (enable) {
        return stripe.subscriptions.del(idSubscription)
            .then(res => {
                return res;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }

}
//fin seccion subcropciones
function checkEvent(id) {
    if (enable) {
        return stripe.events.retrieve(id)
            .then(event => {
                return event;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}
//inicio seccion cupones
function addCoupon(coupon) {
    if (enable) {
        delete coupon.id;
        delete coupon.description;
        delete coupon.__v;
        delete coupon.updatedAt;
        delete coupon.createdAt;
        if (coupon.duration === "") {
            delete coupon.duration;
        }
        if (coupon.amount_off === "") {
            delete coupon.amount_off;
        }
        if (coupon.duration_in_months === "") {
            delete coupon.duration_in_months;
        }
        if (coupon.percent_off === "") {
            delete coupon.percent_off;
        }
        coupon.id = coupon.codeName;
        delete coupon.codeName;
        return stripe.coupons.create(coupon)
            .then(() => {
                coupon.codeName = coupon.id;
                delete coupon.id;
                return coupon;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }
}

function removeCoupon(entity) {
    if (enable) {
        return stripe.coupons.del(entity.codeName)
            .then(() => {
                return entity;
            })
            .catch(err => {
                logger.error(err);
                throw err;
            })
    } else {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }

}

//fin seccion cupones
module.exports = mod;
