var config          = require('./config'),
    express         = require('express'),
    http            = require('http'),
    exphbs          = require('express3-handlebars'),
    colors          = require('colors'),
    passport        = require('passport'),
    logger          = require('./services/logger'),
    LocalStrategy   = require('passport-local').Strategy,
    RedisStore      = require('connect-redis')(express),
    ipban           = require('./middleware/ipban.js'),
    auth            = require('./middleware/auth.js'),
    pool            = require('./pool'),
    kue             = require('kue'),
    redis           = require('redis');

app = express();

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

app.configure('development', function () {
    app.set('views', __dirname + '/views');
    app.set('view cache', false);
    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        store: new RedisStore({
            host: config.get('redis:host'),
            port: config.get('redis:port'),
            pass: config.get('redis:pass'),
            db: config.get('redis:db')
        }),
        secret: config.get('express:secret')
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(auth());
    app.use(ipban());
    app.use(app.router);
});

require('./routes');

kue.redis.createClient = function () {
    var client = redis.createClient(config.get('redis:port'), config.get('redis:host'));
    client.auth(config.get('redis:pass'));
    return client;
};
require('./services/kue_processes')();
require('./services/kue_jobs')();
kue.app.listen(4000);

http.createServer(app).listen(config.get('express:port'), function () {
    console.log('Express server listening on port ' + config.get('express:port'));
});