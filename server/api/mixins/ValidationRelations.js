'use strict'

let _ = require('lodash');
var async = require('async');

let validationRelations = function (ctx, next) {
    if (ctx.instance) {
        let relations = ctx.Model.definition.settings.relations;
        let relationsArray = _.map(relations, rel => {
            return { modelName: rel.model, fk: rel.foreignKey, type: rel.type, options: rel.options };
        });

        let thisModel = ctx.Model;
        async.map(relationsArray, (relation, cb) => {
            if (relation.options !== undefined) {
                let fk = relation.fk;
                if (fk === "") {
                    fk = relation.modelName + "Id";
                }
                let parentId = ctx.instance[fk];
                if (relation.options.required && parentId === undefined) {
                    cb(fk + ' is required');
                } else if (parentId === undefined) {
                    cb();
                } else {
                    if (relation.options.validate) {
                        let parentModelName = relation.modelName;
                        let parentModel = thisModel.app.models[parentModelName];
                        parentModel.findById(parentId).then(function (parentInstance) {
                            if (parentInstance === null) {
                                cb(fk + ' is not exits');
                            } else {
                                cb();
                            }
                        })
                    }
                }
            } else {
                cb();
            }
        }, (err, res) => {
            if (err) {
                next(err);
            } else {
                next();
            }
        })
    } else {
        next();
    }
}

module.exports = function (Model, options) {
    Model.observe('before save', validationRelations);
};