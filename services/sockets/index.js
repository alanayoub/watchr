var passport_socket_io = require('passport.socketio'),
    express = require('express'),
    logger = require('../../services/logger'),
    dbquery = require('../../db/query');
module.exports = function (config) {
    var io = require('socket.io').listen(config.server), user;
    var success = function (data, accept) {
        accept(null, true);
        user = data.user;
        logger.info('Socket auth success');
    };
    var fail = function (data, message, error, accept) {
        logger.error('Socket auth failed', error);
        if (error) throw new Error(message);
        else accept(null, false);
    };
    io.set('authorization', passport_socket_io.authorize({
        cookieParser: express.cookieParser,
        secret: config.session_options.secret,
        store: config.session_options.store,
        success: success,
        fail: fail
    }));
    io.sockets.on('connection', function (socket) {
        socket.on('init_task', function () {
            console.log('init_task');
            dbquery.task.user({user_id: user.id}).then(function (result) {
                if (result.error) {
                    logger.error('Error getting user tasks %j', result.error);
                    throw result.error;
                }
                if (result.data) {
                    socket.emit('task', {result: result.data});
                }
            });
        });
    });
};