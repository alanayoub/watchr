var config          = require('./config'),
    express         = require('express'),
    http            = require('http'),
    exphbs          = require('express3-handlebars'),
    colors          = require('colors'),
    passport        = require('passport'),
    logger          = require('./services/logger'),
    RedisStore      = require('connect-redis')(express),
    ipban           = require('./middleware/ipban.js'),
    auth            = require('./middleware/auth.js');

require('./middleware/passport');

app = express();
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
require('./services/kue');

http.createServer(app).listen(config.get('express:port'), function () {
    console.log('Express server listening on port ' + config.get('express:port'));
});