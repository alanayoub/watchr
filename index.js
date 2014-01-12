var config             = require('./config'),
    express            = require('express'),
    http               = require('http'),
    exphbs             = require('express3-handlebars'),
    colors             = require('colors'),
    passport           = require('passport'),
    logger             = require('./services/logger'),
    ipban              = require('./middleware/ipban.js'),
    auth               = require('./middleware/auth.js'),
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
app.configure('development', function () {
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
require('./services/kue');
require('./services/sockets')({server: server, session_options: session_options});