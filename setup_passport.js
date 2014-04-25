var passport = require('passport'),
    dbquery = require('./db/query'),
    LocalStrategy = require('passport-local').Strategy,
    pool = require('./pool');
passport.use(new LocalStrategy(
    function (username, password, done) {
        dbquery.user.authenticate({username: username, password: password}).then(function (result) {
            if (result.error) {
                logger.error(__filename, 'Error authenticating');
                return done(result.error);
            }
            if (!result.data.length) {
                console.log('no active user found');
            }
            if (result.data) return done(null, result.data[0]);
            else return done(null, false, {message: 'Incorrect credentials'});
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    dbquery.user.get({user_id: id}).then(function (result) {
        if (result.error) {
            logger.error(__filename, 'Error getting user with id %d', id);
            return done(result.error);
        }
        if (!result.data.length) console.log('no user found with id %d', id);
        else return done(null, result.data[0]);
    });
});