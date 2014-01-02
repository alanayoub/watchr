var $       = require('jquery'),
    dbquery = require('../db/query'),
    logger  = require('./logger'),
    pool    = require('../pool');
module.exports = function (config) {
    var scrape_results = config.results, $deferred = $.Deferred();
    dbquery.task.exists({selector: config.selector, url: config.url}).then(function (task_results) {
        var task_id;
        if (task_results.error) {
            logger.error('Error getting tasks %j', task_results.error);
            $deferred.reject(task_results.error);
            throw task_results.error;
        }
        if (task_results.data.length) {
            task_id = task_results.data[0].id;
            dbquery.task.update({id: task_id});
            dbquery.result.last({task_id: task_id, limit: 1}).then(function (result) {
                if (result.error) {
                    logger.error('dbquery.result.last %j', result.error);
                    $deferred.reject(result.error);
                    throw result.error;
                }
                logger.info('result.data', result.data);
                if (result.data && result.data[0] && result.data[0].value === scrape_results) {
                    dbquery.result.update({id: result.data[0].id, value: scrape_results});
                }
                else {
                    logger.info('scrape_handler: no result, insert new');
                    dbquery.result.insert({task_id: task_id, value: scrape_results});
                }
                $deferred.resolve();
            });
        }
        else if (config.user_id) {
            dbquery.task.insert({id: config.user_id, url: config.url, css: config.selector}).then(function (result) {
                if (result.error) {
                    logger.error('dbquery.task.insert %j', result.error);
                    $deferred.reject(result.error);
                    throw result.error;
                }
                logger.info('scrape_handler.js: task inserted %j', result);
                dbquery.result.insert({task_id: result.data.insertId, value: scrape_results}).then(function (result) {
                    $deferred.resolve(result);
                });
            });
        }
    });
    return $deferred.promise();
};