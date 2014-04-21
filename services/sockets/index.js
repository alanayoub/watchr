var $ = require('jquery'),
    express = require('express'),
    passport_socket_io = require('passport.socketio'),
    logger = require('../../services/logger'),
    formatter = require('../../services/formatter'),
    socketio = require('socket.io');
module.exports = function (server, session_options) {
    var $deferred = $.Deferred(),
        io = socketio.listen(server);
    logger.info('setting authorization');
    io.set('authorization', passport_socket_io.authorize({
        cookieParser: express.cookieParser,
        secret: session_options.secret,
        store: session_options.store,
        success: function (data, accept) {
            accept(null, true);
            io.user = data.user;
            logger.info('Socket auth success');
            $deferred.resolve(io, data.user);
        },
        fail: function (data, message, error, accept) {
            logger.error('Socket auth failed', error);
            if (error) throw new Error(message);
            else accept(null, false);
        }
    }));
    return $deferred.promise();
};
