var $       = require('jquery'),
    dbquery = require('../../db/query'),
    logger  = require('./../logger'),
    pool    = require('../../pool'),
    util = require('util'),
    events = require('events');

var ScrapeHandler = module.exports = function () {
    events.EventEmitter.call(this);
}

util.inherits(ScrapeHandler, events.EventEmitter);

ScrapeHandler.prototype.handle = function (config) {

    var module = this, 
        scrape_results = config.results, 
        $deferred = $.Deferred();

    dbquery.task.exists({css: config.css, url: config.url, user_id: config.user_id}).then(function (task_results) {

        logger.info(__filename, ': Checking if task exists');
        logger.info(__filename, ': Task results : %j', task_results);

        if (task_results.error) {
            logger.error(__filename, ': %j', task_results.error);
            module.emit('data', {type: 'task:update', data: task_results.error});
            $deferred.reject(task_results.error);
            throw task_results.error;
        }

        var task_id = config.id || (task_results.data.length && task_results.data[0].id);

        // Task already exists
        if (task_id) {
            logger.info(__filename, ': Task exists');
            
            dbquery.task.updateTimestamp({id: task_id});
            logger.info(__filename, ': Update task timestamp');

            // Get the latest result for this task
            dbquery.result.get({task_id: task_id, limit: 1}).then(function (result) {

                if (result.error) {
                    logger.error(__filename, ': %j', result.error);
                    $deferred.reject(result.error);
                    throw result.error;
                }
                
                logger.info(__filename, ': Latest result :', result.data);

                logger.info(__filename, ': Insert new result');
                dbquery.result.new({task_id: task_id, value: scrape_results});
                module.emit('data', {type: 'task:update', data: result.data});

                $deferred.resolve();
            });
        }
        // Task doesnt exist
        else if (config.user_id) {
            logger.info(__filename, ': Task doesn\'t exist :');
            var options = {id: config.user_id, url: config.url, css: config.css, title: config.title};

            // Insert new task
            dbquery.task.new(options).then(function (task_result) {
                if (task_result.error) {
                    logger.error(__filename, ': Inserting new task : %j', task_result.error);
                    $deferred.reject(task_result.error);
                    throw task_result.error;
                }
                logger.info(__filename, ': New Task inserted %j', task_result);
                dbquery.result.new({task_id: task_result.data.insertId, value: scrape_results}).then(function (result) {
                    logger.info(__filename, ': New Result inserted %j', result);
                    module.emit('data', {
                        type: 'task:new',
                        data: {id: task_result.data.insertId}
                    });
                    $deferred.resolve(result);
                });
            });
        }
    });
    return $deferred.promise();
}
