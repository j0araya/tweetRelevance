'use strict'

let _ = require('lodash');
var async = require('async');
const util = require('../../utils/global');
module.exports = {
    validate: validate
}

function validate(model, data, callback) {
    callback = callback || util.createPromiseCallback();
    let relations = model.definition.settings.relations;
    let relationsArray = _.map(relations, rel => {
        return {
            modelName: rel.model,
            fk: rel.foreignKey,
            type: rel.type,
            options: rel.options
        };
    });
    let thisModel = model;
    async.map(relationsArray, (relation, cb) => {
        if (relation.type === "embedsMany" || relation.type === "embedsOne") {
            cb();
        } else if (relation.options !== undefined) {
            let fk = relation.fk;
            if (fk === "" || fk === undefined) {
                fk = relation.modelName.toLowerCase() + "Id";
            }
            let parentId;
            try {
                parentId = data[fk];
            } catch (e) {
                cb(fk + ' is required');
                return;
            }
            if (relation.options.required && (parentId === undefined || parentId === "")) {
                cb(fk + ' is required');
                return;
            } else if (parentId === undefined) {
                cb();
            } else if (relation.options.validate) {
                let parentModelName = relation.modelName;
                let parentModel = thisModel.app.models[parentModelName];
                parentModel.findById(parentId).then(function (parentInstance) {
                    if (parentInstance === null) {
                        cb(fk + ' is not exits');
                    } else {
                        cb();
                    }
                }).catch(e => {
                    cb(e);
                })
            } else {
                cb();
            }
        } else {
            cb();
        }
    }, (err, res) => {
        if (err) {
            let er = new Error(err);
            er.status = 422;
            callback(er);
        } else {
            callback();
        }
    })
    if (callback.promise) {
        return callback.promise;
    }
};
