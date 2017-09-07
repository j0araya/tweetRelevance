module.exports = function (app) {
    app.get('/login', function (req, res) {
        res.render('login');
    });
    app.get('/api/redirect', function (req, res) {

        res.redirect(app.get('hostClient') + req.query.url);
    });
}