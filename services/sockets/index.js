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
        socket.on('tasks', function () {
            dbquery.task.all({user_id: user.id}).then(function (result) {
                if (result.error) {
                    logger.error('Error getting user tasks %j', result.error);
                    throw result.error;
                }
                if (result.data) {
                    socket.emit('tasks', {result: result.data});
                }
            });
        });
        socket.on('result', function (params) {
            logger.error('Socket request for result with params ', params);
            dbquery.result.last({task_id: params.id}).then(function (result) {
                if (result.error) {
                    logger.error('Error getting user result %j', result.error);
                    throw result.error;
                }
                if (result.data) {
                    var testdata = {
                        set: {
                            label: 'test',
                            data: result.data.reduce(function (acc, val) {
                                val.asof = Date.parse(val.asof);
                                acc.push([val.asof, val.value.replace(/[^\d]*([\d.]+)[^\d]*/, '$1')]);
                                return acc;
                            }, [])
                        },
                        format: 'Number',
                        original: result.data
                    };
                    socket.emit('result', testdata);
                }
            });
        });
    });
};