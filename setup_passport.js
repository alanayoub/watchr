var passport = require('passport'),
    dbquery = require('./db/query'),
    logger = require('./services/logger'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    pool = require('./pool');

passport.use(new LocalStrategy(
    function (username, password, done) {
        logger.info(__filename, 'Local strategy');
        dbquery.user.authenticate({username: username, password: password}).then(function (result) {
            if (result.error) {
                logger.error(__filename, 'Error authenticating');
                return done(result.error);
            }
            if (!result.data.length) {
                logger.info(__filename, 'no active user found');
            }
            if (result.data) return done(null, result.data[0]);
            else return done(null, false, {message: 'Incorrect credentials'});
        });
    }
));

passport.use(new GoogleStrategy({
        returnURL: 'http://localhost:3000/auth/google/return',
        realm: 'http://localhost:3000'
    },
    function (identifier, profile, done) {
        logger.info(__filename, 'Google strategy');
        dbquery.user.get({uuid: identifier}).then(function (result) {
            if (result.error) {
                logger.info(__filename, 'Error querying for user');
            }
            if (result.data[0]) {
                logger.info(__filename, 'User exists');
                profile.uuid = identifier;
                done(result.error, profile);
            }
            if (!result.data.length) {
                logger.info(__filename, 'User does not exist');
                logger.info(__filename, 'Create user');
                dbquery.user.newGoogleUser({username: profile.displayName, uuid: identifier}).then(function (result) {
                    profile.uuid = identifier;
                    done(result.error, profile);
                });
            }
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.uuid);
});

passport.deserializeUser(function (uuid, done) {
    dbquery.user.get({uuid: uuid}).then(function (result) {
        if (result.error) {
            logger.error(__filename, 'Error getting user with id %d', uuid);
            return done(result.error);
        }
        if (!result.data.length) logger.info(__filename, 'no user found with id %d', uuid);
        else return done(null, result.data[0]);
    });
});