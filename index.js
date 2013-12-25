var express         = require('express'),
    mysql           = require('mysql'),
    http            = require('http'),
    exphbs          = require('express3-handlebars'),
    colors          = require('colors'),
    scraper         = require('./scraper'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    RedisStore      = require('connect-redis')(express),
    ipban           = require('./middleware/ipban.js'),
    auth            = require('./middleware/auth.js'),
    app             = express(),
    pool            = mysql.createPool({
        host     : 'localhost',
        user     : 'alan',
        password : 'sdfaslkj&sdlkjklsdfjklj"$skldTfjsdklaf',
        connectionLimit: 10
    });

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
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view cache', false);
    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        store: new RedisStore({
            host: 'localhost',
            port: 6379,
            db: 0,
            pass: 'sfjklarj34%$£%RET£$TSD@:DF%$E£'
        }),
        secret: 'sfjklarj34%$£%RET£$TSD@:DF%$E£'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(auth());
    app.use(ipban());
    app.use(app.router);
});

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/api/login', function (req, res, next) {
    passport.authenticate('local', function (error, user, info) {
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

app.post('/api/logout', function (req, res) {
    console.log('try logging out');
    req.logout();
    if (!req.user) {
        res.send('You are logged out');
    }
});

app.post('/api/search', function (req, res) {
    console.log('POST: %j'.green, req.body);
    scraper.scraper(req.body, function (result) {
        console.log('Result: %s'.green, result);
        res.send(result);
    });
});

app.get('/api/user', function (req, res) {
    console.log('try to get user details');
    if (req.user) {
        res.send({user: req.user});
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});