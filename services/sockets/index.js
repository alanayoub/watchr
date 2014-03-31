var $ = require('jquery'),
    express = require('express'),
    passport_socket_io = require('passport.socketio'),
    logger = require('../../services/logger'),
    formatter = require('../../services/formatter'),
    dbquery = require('../../db/query');
module.exports = function (config) {
    var io = require('socket.io').listen(config.server);
    io.set('authorization', passport_socket_io.authorize({
        cookieParser: express.cookieParser,
        secret: config.session_options.secret,
        store: config.session_options.store,
        success: function (data, accept) {
            accept(null, true);
            io.user = data.user;
            logger.info('Socket auth success');
        },
        fail: function (data, message, error, accept) {
            logger.error('Socket auth failed', error);
            if (error) throw new Error(message);
            else accept(null, false);
        }
    }));
    return io;
};
