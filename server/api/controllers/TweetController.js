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
        Tweet.subscribe(req, 'new-tweet');
        return res.send({ connected: req.isSocket });
    }
};

