module.exports = {
    // create: function (req, res) {
    //     var data_from_client = req.params.all();
    //     // sails.log('aaaaa');
    //     // if (req.isSocket && req.method === 'POST') {

    //     // This is the message from connected client
    //     // So add new conversation// This is the message from connected client
    //     // So add new conversation
    //     User.create({ name: 'hola' })
    //         .exec((error, data_from_client) => {
    //             console.log(data_from_client);
    //             User.publishCreate({
    //                 id: data_from_client.id,
    //                 message: data_from_client.message,
    //                 user: data_from_client.user
    //             });
    //             User.message('message', 'dadadasda');
    //             // var socket = require('socket.io-client')('http://localhost:1337')
    //             // socket.emit('message', data_from_client, (data) => {
    //             //     sails.log('data',data);
    //             // });
    //             return res.send(data_from_client);
    //         });
    // },
    sysInfo: (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }
        sails.sockets.join(req, 'system', err => {
            if (err) {
                return res.serverError(err);
            }
            SystemService.getStaticData().then(data => {;
                return res.send({
                    message: 'Conecatado a la informacion del sistema !',
                    connected: req.isSocket,
                    data: data
                });
            });
        });
    },
    subscribe: (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }
        sails.sockets.join(req, 'tweets', err => {
            if (err) {
                return res.serverError(err);
            }
            return res.send({
                message: 'Recibiendo Tweets',
                connected: req.isSocket
            });
        });
    },
    unsuscribe: (req, res) => {
        sails.sockets.leave(req, 'tweets', err => {
            if (err) {
                return res.serverError(err);
            }
            return res.send({
                message: 'Off.',
                connected: req.isSocket
            });
        });
    }
};