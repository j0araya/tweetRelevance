'use strict';
const _ = require("lodash");
const app = require('../../server');
const Promise = require("bluebird");
const mime = require('mime');
var logger = require('../../utils/logger')('api:modules:storageS3');
const formidable = require('formidable');
const fs = require('fs');
const limitMgUpload = 10;
const uuidv4 = require('uuid/v4');
const bucker = app.get('amazonS3').bucket;
const qs = require('qs');
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIAIAL27ACC3XA7GFTQ',
    secretAccessKey: '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'
});
AWS.config.update({
    region: 'sa-east-1'
});
var mod = {
    uploadParseReq: uploadParseReq,
    uploadFiles: uploadFiles,
    validateFiles: validateFiles,
    removeFile: removeFile,
    uploadFromBuffer: uploadFromBuffer
};

function removeFile(key) {
    return new Promise(function (resolve, reject) {
        const ImageAmazon = app.models.ImageAmazon;
        if (key === "") {
            resolve(true);
        }
        ImageAmazon.removeFile(bucker, key, (err, res) => {
            if (err) {
                logger.error(err);
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}
//validacion de tipos de archivos
function validateFiles(files, type) {
    if (files.file) {
        let fileMime = mime.lookup(files.file.name);
        return _.includes(fileMime, type);
    }
    return true;
}
function uploadFromBuffer(folder, name, file, cb) {
    const ImageAmazon = app.models.ImageAmazon;
    var random = uuidv4();
    var s3 = new AWS.S3();
    s3.putObject({
        Bucket: bucker,
        Key: folder + "/" + random + name,
        Body: file.buffer,
        ACL: 'public-read'
    }, function (err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, {
                src: "https://s3-sa-east-1.amazonaws.com/" + bucker + "/" + folder + "/" + random + name,
                keyAmazon: folder + "/" + random + name,
                width: file.width,
                height: file.height
            });
        }
    });
}
//subida de archivos
function uploadFiles(folder, files) {
    return new Promise(function (resolve, reject) {
        const ImageAmazon = app.models.ImageAmazon;
        var random = uuidv4();
        let writeStream = ImageAmazon.uploadStream(bucker, folder + "/" + random + files.file.name, { acl: 'public-read' });

        writeStream.on('log::*', function (message, object) {
            if (object) {
                logger.info(this.event.split('::')[1] + ' ' + message);
                logger.info(object);
            }
            else {
                logger.info(this.event.split('::')[1] + ' ' + message);
            }
        });

        writeStream.on('error', function (err) {
            // handle your error case
            logger.error(err);
            reject(err);
        });

        writeStream.on('success', function (file) {
            // success, file will be a File model
            //  logger.info('success:', file);
            resolve(file);
        });

        var readStream = fs.createReadStream(files.file.path);
        readStream.pipe(writeStream);
    })
}
//parseo de request
function uploadParseReq(req, bypass = false, multiFile = false) {
    return new Promise(function (resolve, reject) {
        if (bypass) {
            resolve(null);
        } else {
            let bucker = app.get('amazonS3').bucket;
            let form = new formidable.IncomingForm();
            form.maxFieldsSize = limitMgUpload * 1024 * 1024;
            form.multiples = multiFile;
            form.parse(req, function (error, fields, files) {
                if (error) {
                    logger.error('Error:' + error);
                    reject(error);
                } else {
                    resolve({ fields: qs.parse(fields), files: files });
                }
            });
        }
    });
}

module.exports = mod;