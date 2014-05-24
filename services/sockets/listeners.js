var $ = require('jquery'),
    logger = require('../../services/logger'),
    formatter = require('../../services/formatter'),
    scraper = require('../scraper/scraper'),
    ScrapeHandler = require('../scraper/scrape_handler'),
    dbquery = require('../../db/query');

var deletetask = function (socket, id) {
    logger.info('deleteing task');
    dbquery.task.updateActive({id: id, value: 0}).then(function (result) {
        if (result.error) {
            logger.error(__filename, 'Error deleting task %d', id);
            socket.emit('taskdeleted', {status: 'failed', error: true});
            throw result.error;
        }
        if (result.data) {
            socket.emit('taskdeleted', {status: 'success', id: id});
        }
    });
};

var gettodotasklist = function (hours, limit) {
    logger.info(__filename, 'Getting tasks');
    var $deferred = $.Deferred();
    dbquery.task.getScrapeTasks({olderthan: hours, limit: limit}).then(function (result) {
        if (result.error) {
            logger.error(__filename, 'Getting tasks list: %j', result.error);
            $deferred.reject(result);
        }
        if (result.data) {
            logger.info(__filename, 'Got %d tasks to add to queue', result.data.length);
            var obj = result.data.reduce(function (acc, val, idx) {
                acc.push({
                    id: val.id,
                    url: val.url,
                    css: val.css
                });
                return acc;
            }, []);
            $deferred.resolve(obj);
        }
    });
    return $deferred.promise();
};

var getalltasks = function (socket, userid) {
    dbquery.task.getDisplayTasks({user_id: userid}).then(function (result) {
        if (result.error) {
            logger.error(__filename, 'Error getting user tasks %j', result.error);
            throw result.error;
        }
        if (result.data) {
            socket.emit('tasks', {result: result.data});
        }
    });
};

var getonetask = function (socket, taskid) {
    dbquery.task.getDisplayTasks({task_id: taskid}).then(function (result) {
        if (result.error) {
            logger.error(__filename, 'Error getting user task %j', result.error);
            throw result.error;
        }
        if (result.data) {
            socket.emit('task:update', result.data);
        }
    });
};

var updateTaskType = function (socket, type, taskId, userId) {
    logger.warn(__filename, 'USERID: ', userId);
    if (!userId) {
        logger.info(__filename, 'User needs to be logged in to update tasks');
        return;
    }
    logger.info(__filename, 'updateTaskType for taskId %d', taskId);
    dbquery.task.updateType({id: taskId, value: type, user_id: userId}).then(function (result) {
        if (result.error) {
            logger.error(__filename, 'Error updating task type %j', result.error);
            throw result.error;
        }
        if (result.data) {
            logger.info(__filename, 'Success updating task type');
            getResults(socket, taskId, userId);
        }
    });
};

var updateTaskRegex = function (socket, regex, taskId, userId) {
    if (!userId) {
        logger.info(__filename, 'User needs to be logged in to update tasks');
        return;
    }
    logger.info(__filename, 'updateTaskRegex for taskId %d', taskId);
    dbquery.task.updateRegex({id: taskId, value: regex}).then(function (result) {
        if (result.error) {
            logger.error(__filename, 'Error updating regex type %j', result.error);
            throw result.error;
        }
        if (result.data) {
            logger.info(__filename, 'Success updating regex type');
            getResults(socket, taskId, userId);
        }
    });
};

var getResults = function (socket, taskId) {
    logger.info(__filename, 'getResults for %d', taskId);
    $.when(
        dbquery.result.get({task_id: taskId}),
        dbquery.task.getOneTask({id: taskId})
    ).then(function (result, task) {
        if (result.error) {
            logger.error('Error getting user result %j', result.error);
            throw result.error;
        }
        if (!result.data || !task.data[0]) return;
        var task = task.data[0],
            data = formatter(result.data, task.type, task.regex);

        socket.emit('Hello', {
            that: 'only',
            '/p': 'will get'
        });
        socket.emit('p', {test: 'testy'});

        socket.emit('result', {
            set: {
                data: data
            },
            meta: {
                title: task.title,
                url: task.url,
                regex: task.regex
            },
            format: data.type || 'String'
        });
    });
};

var scrape = function (socket, options, scrape_handler, userid) {
    logger.info(__filename, ': Scrape :', options);
    scraper(options).then(
        function (result) {
            logger.info(__filename, ': Scrape Success :', result);
            socket.emit('searchsuccess');
            scrape_handler.handle({
                results: result,
                selector: options.selector,
                url: options.url,
                title: options.title,
                user_id: userid
            });
        }, 
        function (error) {
            logger.error(__filename, ': Scrape :', error);
        }
    );
};

module.exports = function (io, scrapeque) {
    scrapeque.then(function (scrapeque) {
        io.sockets.on('connection', function (socket) {
            socket.on('chromeGetTasks', function () {
                gettodotasklist(0.1, 3).then(function (result) {
                    socket.emit('chromeTasks', result);
                });
            });
            var user = io.user;
            var scrape_handler = (new ScrapeHandler()).on('data', function (result) {
                logger.info(__filename, ': data : ', result);
                if (result.type === 'task:new') {
                    getonetask(socket, result.data.id);
                }
                if (result.type === 'task:update') {
                    socket.emit(result.type, result.data);
                }
            });
            scrapeque.on('data', function (result) {
                logger.info(__filename, ': socket.on:data');
                if (!result) return;
                if (result.type === 'task:update') getonetask(socket, result.data[0].task_id);
                if (result.type === 'tasks') console.log('go do tasks stuff');
            });
            socket.on('deletetask', function (id) {
                logger.info(__filename, ': socket.on:deletetask %d', id);
                if (!id) return;
                deletetask(socket, id);
            });
            socket.on('tasks', function () {
                logger.info(__filename, ': socket.on:tasks');
                if (!user) return;
                getalltasks(socket, user.id);
            });
            socket.on('search', function (data) {
                logger.info(__filename, ': socket.on:search :', data);
                if (!user) return;
                scrape(socket, data, scrape_handler, user.id);
            });
            /* REGEX feature development on pause
            socket.on('update:regex', function (data) {
                logger.info(__filename, ': socket.on:update:regex', data);
                updateTaskRegex(socket, data.regex, data.id, user.id);
            });
            */
            socket.on('update:type', function (data) {
                if (!user) return;
                logger.info(__filename, ': socket.on:update:type', data);
                updateTaskType(socket, data.type, data.id, user.id);
            });
            socket.on('result', function (data) {
                logger.info(__filename, ': socket.on:result', data);
                getResults(socket, data.id);
            });
            socket.on('disconnect', function () {
                logger.info(__filename, 'DISCONNECTED');
                delete io.user;
            });
        });
    });
};
