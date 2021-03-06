var $       = require('jquery'),
    config  = require('../../config'),
    logger  = require('./../logger'),
    dbquery = require('../../db/query'),
    Que     = require('./que'),
    scraper = require('../scraper/scraper'),
    ScrapeHandler = require('../scraper/scrape_handler'),
    hours = config.get('app:que:update:tasks_older_than_x_minutes'),
    limit = config.get('app:que:update:limit_number_of_tasks');

module.exports = function () {
    var $deferred = $.Deferred(),
        q = new Que();
    var scrape_handler = (new ScrapeHandler()).on('data', function (result) {
        q.emit('data', result);
    });
    var gettasks = function () {
        logger.info(__filename, 'Getting tasks');
        var $deferred = $.Deferred();
        dbquery.task.getScrapeTasks({olderthan: hours, limit: limit}).then(function (result) {
            if (result.error) {
                logger.error(__filename, 'Getting tasks list: %j', result.error);
                $deferred.reject(result);
            }
            if (result.data) {
                logger.info(__filename, 'Got %d tasks to add to queue', result.data.length);
                $deferred.resolve(result);
            }
        });
        return $deferred.promise();
    };
    var createjobs = function (tasks) {
        logger.info(__filename, 'Create jobs');
        tasks.forEach(function (val) {
            var options = {
                title: 'Scrape: ' + val.url,
                css: val.css,
                url: val.url,
                id: val.id,
                user_id: val.user_id
            };
            q.job.add('scrape', options);
        });
    };
    q.process.add('scrape', function (options, success, fail) {
        logger.info(__filename, 'doing a scrape job', options);
        scraper(options).then(
            function (result) {
                logger.info(__filename, 'result', result);
                scrape_handler.handle({
                    results: result,
                    css: options.css,
                    url: options.url,
                    user_id: options.user_id
                }).then(success);
            },
            function (error) {
                logger.error(__filename, 'error', error);
                if (error.type === 'dnserror') return; // no internet
                dbquery.task.updateFailed({id: options.id, value: 1}).then(function (result) {
                    logger.warn('set job %d to failed', options.id);
                    q.job.del(options.id);
                    fail(result);
                });
            }
        );
    });
    setInterval(function () {
        if (!q.job.get().length) {
            gettasks().then(function (result) {
                if (result.error) logger.error(__filename, 'Error getting tasks: %j', result.error);
                if (result.data.length) createjobs(result.data);
            });
        }
    }, config.get('app:que:update:interval'));
    $deferred.resolve(q);
    return $deferred.promise();
}
