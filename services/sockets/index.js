var $ = require('jquery'),
    logger = require('../../services/logger'),
    formatter = require('../../services/formatter'),
    scraper = require('../scraper/scraper'),
    ScrapeHandler = require('../scraper/scrape_handler'),
    dbquery = require('../../db/query'),
    config = require('../../config'),
    olderThanBrowser = config.get('app:browserExtension:update:tasks_older_than_x_minutes'),
    limitBrowser = config.get('app:browserExtension:update:limit_number_of_tasks'),
    intervalBrowser = config.get('app:browserExtension:update:interval');

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
                css: task.css,
                //regex: task.regex,
                failed: task.failed
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
            socket.emit('searchResult', {success: true});
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
            socket.emit('searchResult', {success: false});
        }
    );
};

var chromeResults = {
    save: function (socket, user, results) {
        userid = user && user.uuid || 'notloggedin';
        results.forEach(function (val, idx, arr) {
            $.when(dbquery.botnet.checkExists({task_id: val.id}))
                .then(function (result) {
                    console.log('checkExists', result.data.length);
                    return result;
                })
                .then(function (result) {
                    var obj = {
                        value: val.value,
                        valueby: userid,
                        task_id: val.id
                    };
                    if (!result.data.length) {
                        dbquery.botnet.insertInit(obj);
                    }
                    else if (result.data[0].valueby !== userid) { // different user
                        $.extend(obj, {confirmed: result.data[0].value === val.value ? 1 : 0});
                        dbquery.botnet.insertConfirm(obj);
                    }
                    return obj;
                })
                .then(function (result) {
                    if (result.confirmed) {
                        dbquery.result.new({
                            task_id: result.task_id,
                            value: result.value
                        }).then(function () {
                            getResults(socket, result.task_id);
                        });
                        dbquery.task.updateTimestamp({id: result.task_id});
                        logger.info(__filename, ': Update task timestamp');
                        // emit a 'scraper' change event
                        // then let listner decide if the current user should get changes
                    }
                });
        });
    }
}

module.exports = function (io, scrapeque) {
    scrapeque.then(function (scrapeque) {
        io.sockets.on('connection', function (socket) {
            var user = io.user;
            // Scrape handler for search
            var scrape_handler = (new ScrapeHandler()).on('data', function (result) {
                logger.info(__filename, ': data : ', result);
                if (result.type === 'task:new') {
                    dbquery.task.getDisplayTasks({
                        task_id: result.data.id,
                        user_id: user.id
                    }).then(function (result) {
                        if (result.data) {
                            socket.emit('task:update', result.data);
                            socket.emit('svr:task:new', {id: result.data[0].task_id});
                        }
                    });
                }
                if (result.type === 'task:update') {
                    socket.emit(result.type, result.data);
                }
            });
            //
            // Chrome plugin
            //
            socket.on('chromeTasksRequest', function () {
                gettodotasklist(olderThanBrowser, limitBrowser).then(function (result) {
                    result.interval = intervalBrowser;
                    socket.emit('chromeTasks', result);
                });
            });
            socket.on('chromeTaskResults', function (results) {
                console.log('Received task results from chrome plugin:\n--> %j', results);
                chromeResults.save(socket, user, results);
            });
            //
            // Scraper
            //
            scrapeque.on('data', function (result) {
                logger.info(__filename, ': socket.on:data');
                if (!result) return;
                if (result.type === 'task:update') {
                    if (!user && !user.id) return;
                    dbquery.task.getDisplayTasks({
                        task_id: result.data[0].task_id,
                        user_id: user.id
                    }).then(function (result) {
                        if (result.data && result.data.length) {
                            socket.emit('svr:scrape:task', result.data);
                        //    getResults(socket, result.data.id);
                        }
                    });
                }
                if (result.type === 'tasks') console.log('go do tasks stuff');
            });
            //
            // Webapplication
            //
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
            // REGEX feature development on pause
            // socket.on('update:regex', function (data) {
            //    logger.info(__filename, ': socket.on:update:regex', data);
            //    updateTaskRegex(socket, data.regex, data.id, user.id);
            // });
            //
            socket.on('update:type', function (data) {
                if (!user) return;
                logger.info(__filename, ': socket.on:update:type', data);
                updateTaskType(socket, data.type, data.id, user.id);
            });
            socket.on('result', function (data) {
                logger.info(__filename, ': socket.on:result', data);
                getResults(socket, data.id);
            });
            socket.on('cli:settings:save', function (data) {
                if (!(data.title && data.css && data.url && data.id && user.id)) {
                    // return error to client
                    return;
                };
                dbquery.task.updateDetails({
                    css: data.css,
                    url: data.url,
                    title: data.title,
                    id: data.id,
                    user_id: user.id
                }).then(function (result) {
                    if (result.error) {
                        logger.error(__filename, 'Error updating details for task %d', data.id);
                        return;
                    }
                    if (result.data) {
                        getResults(socket, data.id, user.id);
                    }
                });
            });
            socket.on('disconnect', function () {
                logger.info(__filename, 'DISCONNECTED');
                delete io.user;
            });
        });
    });
};
