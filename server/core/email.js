const loopback = require('loopback');
const path = require('path');
const logger = require('../utils/logger')('core:email');
const fs = require("fs");
const async = require('async');

function service(server) {
    function send(to, subject, template, data) {
        let html = '';
        async.series([
            (cb) => {
                //chequeo si existe el template
                template = path.resolve(__dirname, '../views/' + template);
                fs.stat(template, (err, stats) => {
                    if (err) {
                        cb(err);
                        return;
                    }
                    if (stats.isFile()) {
                        cb();
                    } else {
                        cb('is not file template');
                    }
                });
            },
            (cb) => {
                //render de template a html
                try {
                    var templateLoopback = loopback.template(template);
                    html = templateLoopback(data);
                    cb();
                } catch (e) {
                    cb(e);
                }

            },
            (cb) => {
                //envio del correo
                server.models.Email.send({
                    to: to,
                    subject: subject,
                    html: html
                }, function (err, mail) {
                    cb(err);
                });
            }
        ], function (err, results) {
            if (err) {
                logger.error(err);
                return false;
            } else {
                logger.info('Email send.');
                return true
            }
        });


    }

    let emailService = {
        send: send
    };
    server.email = emailService;

    //test de uso de servicio
    // let data = { text: "este es un texto" }
    // server.email.send('freddy.jimen@gmail.com', 'este es un test', 'verify.ejs', data);
}
module.exports = service;