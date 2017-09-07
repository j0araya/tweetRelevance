/*Ce mixin permet de vérifier les contraintes d'intégrité (si l'objet parent possède des enfants, on ne peut pas le supprimer)
en faisant une requête sur les enfants qui sont rattachés à ce parent*/

'use strict'

let _ = require('lodash');

let checkHasManyIntegrity = function (ctx, next) {
    if (ctx.where) {
        let relations = ctx.Model.definition.settings.relations;
        let relationsArray = _.map(relations, rel => {
            return { modelName: rel.model, fk: rel.foreignKey, type: rel.type };
        });

        /* On utilise Lodash pour transformer l'objet des relations en Tableau de la forme
          [
            { modelName: 'achat', fk: 'achat_id', type: 'belongsTo' },
            { modelName: 'FED_AGENT', fk: 'agent_rfagent', type: 'belongsTo' }
          ]
        */

        let thisModel = ctx.Model;
        // Le message qui sera renvoyé en cas d'échec de vérification des contraintes d'intégrité
        let message = "";
        // Le tableau des promises correspondant aux requêtes vérifiants les contraintes
        let promiseArray = [];

        relationsArray.forEach(function (relation) {
            if (relation.type == 'hasMany') {
                let childrenModelName = relation.modelName;
                let childrenModel = thisModel.app.models[childrenModelName];
                let parentId = ctx.where.id;
                let whereObject = {};
                whereObject[relation.fk] = ctx.where.id;
                // On cherche les enfants éventuels
                promiseArray.push(childrenModel.find({
                    where: whereObject
                }).then(function (data) {
                    if (data.length > 0) { // Si il y a des enfants, on renvoit une erreur
                        message += 'This "' + thisModel.modelName + '" has "' + childrenModelName + '", and can\'t be deleted. ';
                    }
                }));

            }
        }
        );

        /* Une fois que toutes les promesses ont été déterminées et conduisent vers un message en cas de non respect de la contrainte d'intégrité,
        on les regroupe dans une promesse commune résolue quand toutes sont résolues et qui renvoit le message en cas de non respect de contrainte */
        Promise.all(promiseArray)
            .then(
            function () {
                next(message);
            }
            , console.error)
            .catch(function (err) {
                next(err);
            });
    }
}

module.exports = function (Model, options) {
    Model.observe('before delete', checkHasManyIntegrity);
};