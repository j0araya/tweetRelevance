var logger = require('../../utils/logger')('middware:responses:error');
const statusCodes = require('http-status-codes');
module.exports = function () {
    return function logError(err, req, res, next) {
        if (err.message === "cancel") {
            return;
        }
        var errors = []
        var statusCode = err.statusCode ||
            err.status ||
            statusCodes.INTERNAL_SERVER_ERROR
        logger.error('Raw error object:', err)

        if (err.details && err.details.messages) {
            logger.info('Handling error as a validation error.')

            // This block is for handling validation errors.
            // Build up an array of validation errors.
            errors = Object.keys(err.details.messages).map(function (key) {
                return buildErrorResponse(
                    statusCode,
                    err.details.messages[key][0],
                    err.details.codes[key][0],
                    err.name,
                    key
                )
            })
        } else if (err.message) {
            // convert specific errors below to validation errors.
            // These errors are from checks on the incoming payload to ensure it is
            // JSON API compliant. If we switch to being able to use the Accept header
            // to decide whether to handle the request as JSON API, these errors would
            // need to only be applied when the Accept header is `application/vnd.api+json`
            var additionalValidationErrors = [
                'JSON API resource object must contain `data` property',
                'JSON API resource object must contain `data.type` property',
                'JSON API resource object must contain `data.id` property'
            ]

            if (additionalValidationErrors.indexOf(err.message) !== -1) {
                logger.info('Recasting error as a validation error.')
                statusCode = statusCodes.UNPROCESSABLE_ENTITY
                err.code = 'presence'
                err.name = 'ValidationError'
            }

            logger.info('Handling invalid relationship specified in url')
            if (/Relation (.*) is not defined for (.*) model/.test(err.message)) {
                statusCode = statusCodes.BAD_REQUEST
                err.message = 'Bad Request'
                err.code = 'INVALID_INCLUDE_TARGET'
                err.name = 'BadRequest'
            }

            if (err.param) {
                err.message = err.param + ': ' + err.message;
            }
            errors.push(
                buildErrorResponse(statusCode, err.message, err.code ? err.code : err.type, err.name, err.param)
            )
        } else {
            logger.info(
                'Unable to determin error type. Treating error as a general 500 server error.'
            )
            // catch all server 500 error if we were unable to understand the error.
            errors.push(
                buildErrorResponse(
                    statusCodes.INTERNAL_SERVER_ERROR,
                    'Internal Server error',
                    'GENERAL_SERVER_ERROR'
                )
            )
        }

        // send the errors and close out the response.
        logger.info('Sending error response')
        logger.info('Response Code:', statusCode)
        logger.error('Response Object:', { errors: errors, message: err.message })
        res.status(statusCode).send({ errors: errors, message: err.message }).end()
    };
};

/**
 * Builds an error object for sending to the user.
 * @private
 * @memberOf {Errors}
 * @param {Number} httpStatusCode specific http status code
 * @param {String} errorDetail error message for the user, human readable
 * @param {String} errorCode internal system error code
 * @param {String} errorName error title for the user, human readable
 * @param {String} propertyName for validation errors, name of property validation refers to
 * @return {Object}
 */
function buildErrorResponse(
    httpStatusCode,
    errorDetail,
    errorCode,
    errorName,
    propertyName
) {
    return {
        status: httpStatusCode || statusCodes.INTERNAL_SERVER_ERROR,
        source: propertyName ? propertyName : '',
        title: errorName || '',
        code: errorCode || '',
        detail: errorDetail || ''
    }
}