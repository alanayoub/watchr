var config             = require('./config'),
    express            = require('express'),
    http               = require('http'),
    exphbs             = require('express3-handlebars'),
    colors             = require('colors'),
    passport           = require('passport'),
    logger             = require('./services/logger'),
    ipban              = require('./middleware/ipban.js'),
    auth               = require('./middleware/auth.js'),
    sockets            = require('./services/sockets'),
    scrapeque          = require('./services/que/scrapeque')(),
    listeners          = require('./services/sockets'),
    RedisStore         = require('connect-redis')(express),
    session_store      = new RedisStore({
        host: config.get('redis:host'),
        port: config.get('redis:port'),
        pass: config.get('redis:pass'),
        db: config.get('redis:db')
    }),
    session_options = {
        store: session_store,
        secret: config.get('express:secret')
    },
    server;

require('./setup_passport');

app = express();
app.configure('development', 'production', function () {
    app.set('views', __dirname + '/views');
    app.set('view cache', false);
    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session(session_options));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(auth());
    app.use(ipban());
    app.use(app.router);
});

server = http.createServer(app).listen(config.get('express:port'), function () {
    console.log('Express server listening on port ' + config.get('express:port'));
});

require('./routes');

var $ = require('jquery'),
    express = require('express'),
    passport_socket_io = require('passport.socketio'),
    socketio = require('socket.io');

    var io = socketio.listen(server);
    logger.info('setting authorization');
    io.set('authorization', passport_socket_io.authorize({
        cookieParser: express.cookieParser,
        secret: session_options.secret,
        store: session_options.store,
        success: function (data, accept) {
            accept(null, true);
            io.user = data.user;
            logger.info('Socket auth success');
        },
        fail: function (data, message, critical, accept) {
            logger.error(__filename, 'Auth failed');
            logger.info(__filename, 'Failed login data', data);
            accept(null, true);
        }
    }));

listeners(io, scrapeque);

