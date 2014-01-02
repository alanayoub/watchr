var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    pool = require('../pool');
passport.use(new LocalStrategy(
    function (username, password, done) {
        var query = 'SELECT * FROM watchr.user WHERE username = ? AND password = ? AND confirmed = 1 AND active = 1';
        pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(query, [username, password], function (error, results) {
                connection.release();
                if (error) return done(error);
                if (!results.length) {
                    console.log('no active user found');
                }
                if (results) return done(null, results[0]);
                else return done(null, false, {message: 'Incorrect credentials'});
            });
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    var query = 'SELECT * FROM watchr.user WHERE id = ?';
    pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(query, [id], function (error, results) {
            connection.release();
            if (results) return done(null, results[0]);
        });
    });
});