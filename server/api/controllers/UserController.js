module.exports = {
    create: function (req, res) {
        var data_from_client = req.params.all();
        // sails.log('aaaaa');
        // if (req.isSocket && req.method === 'POST') {

            // This is the message from connected client
            // So add new conversation// This is the message from connected client
            // So add new conversation
            User.create({ name: 'hola' })
                .exec((error, data_from_client) => {
                    console.log(data_from_client);
                    User.publishCreate({
                        id: data_from_client.id,
                        message: data_from_client.message,
                        user: data_from_client.user
                    });
                    User.message('message', 'dadadasda');
                    // var socket = require('socket.io-client')('http://localhost:1337')
                    // socket.emit('message', data_from_client, (data) => {
                    //     sails.log('data',data);
                    // });
                    return res.send(data_from_client);
                });

        // } else if (req.isSocket) {
        //     User.watch(req.socket);
        //     console.log('User subscribed to ' + req.socket.id);
        //     // subscribe client to model changes 
        // }
    },
    create2: (req, res) => {
        res.send('ok');
    },
    subscribe: function(req, res) {
        sails.log('isSocket',req.isSocket);
        if( ! req.isSocket) {
          return res.badRequest();
        }
        
        User.subscribe(req ,'message');
        // User.subscribe(req ,'message');
        User.message('message','asdadad');
        // User.message('user', 'aaaaaa');

        // sails.sockets.join(req.socket, 'message');
    
        return res.ok();
      }
};