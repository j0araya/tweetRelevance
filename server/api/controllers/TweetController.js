/**
 * TweetController
 *
 * @description :: Server-side logic for managing tweets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    join: (req, res) => {
        sails.log('aaaaaaaaaaaaaaaaaaaaaaaaa');
        if (!req.isSocket) {
            return res.badRequest();
        }
        // var roomName = req.param('roomName');
        sails.sockets.join(req, 'tweets', (err) => {
            if (err) {
                return res.serverError(err);
            }

            return res.json({
                message: 'Subscribed to a fun room called ' + 'tweets' + '!'
            });
        });
    }
};

