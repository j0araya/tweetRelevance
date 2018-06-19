/**
 * TweetController
 *
 * @description :: Server-side logic for managing tweets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    subscribe: (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }
        sails.sockets.join(req, 'tweet-lists', err => {
            if (err) {
                return res.serverError(err);
            }
            return res.send({
                message: 'Recibiendo Tweets',
                connected: req.isSocket
            });
        });
    }
};

