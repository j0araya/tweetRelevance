'use strict';
/**
 * @param {Loopback.ModelConstructor} Plan
 * @return {Loopback.ModelConstructor}
 */
module.exports = function (Plan) {
    Plan.validatesNumericalityOf('cost', {
        int: true,
        message: {
            int: 'is not an integer'
        }
    });
};
