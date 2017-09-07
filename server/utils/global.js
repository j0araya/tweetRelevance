'use strict';
const Promise = require('bluebird');
const crypto = require('crypto');

function createToken() {
    return new Promise(function (resolve, reject) {
        crypto.randomBytes(20, function (err, buf) {
            if (err) {
                reject(err);
            }
            var token = buf.toString('hex')
            resolve(token);
        });
    });
}
function createPromiseCallback() {
    var cb;
    var promise = new Promise(function (resolve, reject) {
        cb = function (err, data) {
            if (err) return reject(err);
            return resolve(data);
        };
    });
    cb.promise = promise;
    return cb;
}
var global = {
    createToken: createToken,
    createPromiseCallback: createPromiseCallback
}
module.exports = global;