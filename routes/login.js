var passport = require('passport'),
    logger = require('../services/logger'),
    pool = require('../pool');
app.post('/api/login', function (req, res, next) {
    passport.authenticate('local', function (error, user, info) {
        logger.info(__filename, 'Authenticate local');
        var query = 'INSERT INTO watchr.login_attempt (username, ip, success) VALUES (?, ?, ?)',
            data = [req.body.username, req.connection.remoteAddress, !!user ? 1 : 0];
        if (error) return next(error);
        pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(query, data, function (error, results) {
                connection.release();
            });
        });
        if (!user) return res.send('Incorrect credentials: You are NOT logged in');
        req.logIn(user, function (error) {
            if (error) return next(error);
            return res.send('You are logged in');
        });
    })(req, res, next);
});

app.post('/auth/google', passport.authenticate('google'));

app.get('/auth/google/return', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
}));
