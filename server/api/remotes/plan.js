'use strict';
const stripe = require('../modules/stripe')
var logger = require('../../utils/logger')('api:controller:plan');
/**
 * @param {Loopback.ModelConstructor} Plan
 * @return {Loopback.ModelConstructor}
 */
module.exports = function (Plan) {
    /* Plan.beforeRemote('**', function (ctx, plan, next, req) {
         debug(ctx.methodString, 'was beforeRemote remotely');
         next();
     });
     Plan.afterRemote('**', function (ctx, plan, next) {
         debug( ctx.methodString, 'was afterRemote remotely');
         next();
     });*/
    //Antes de crear un plan
    Plan.beforeRemote('create', (ctx, plan, next) => {
        //debug('Error:',ctx.args.data);
        //next();
        var plan = new Plan(ctx.args.data);
        plan.isValid(valid => {
            logger.info(valid);
            if (valid) {
                return stripe.addPlan(ctx.args.data).then(stripe => {
                    next();
                }).catch(err => {
                    logger.error(err);
                    next(err);
                })
            } else {
                next();
            }
        })
    });

    //Antes de eliminar un plan
    Plan.beforeRemote('deleteById', (ctx, plan, next) => {
        Plan.findById(ctx.args.id).then(plan => {
            if (plan) {
                logger.info(plan);
                stripe.removePlan(plan.codeName).then(() => {
                    next();
                }).catch(err => {
                    logger.error(err);
                    next();
                })
            } else {
                logger.warn({ name: "Plan not exist", status: 404 });
                next({ message: "Plan not exist", status: 404 });
            }
        }).catch(err => {
            logger.error(err);
            next(err);
        });

    });
};
