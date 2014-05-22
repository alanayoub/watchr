var passport = require('passport'),
    logger = require('../services/logger'),
    dbquery = require('../db/query');
app.post('/api/login', function (req, res, next) {
    passport.authenticate('local', function (error, user, info) {
        logger.info(__filename, 'Authenticate local');
        dbquery.login_attempt.new({
            username: req.body.username,
            ip: req.connection.remoteAddress,
            success: !!user ? 1 : 0,
        }).then(function (result) {
            if (result.error) {
                logger.error(__filename, 'Error storing login attempt info %j', result.error);
            }
        });
        if (error) return next(error);
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
