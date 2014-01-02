var $       = require('jquery'),
    dbquery = require('../../db/query'),
    config  = require('../../config'),
    kue     = require('kue'),
    jobs    = kue.createQueue(),
    logger  = require('./../logger'),
    hours = config.get('app:kue:update:tasks_older_than_x_hours'),
    limit = config.get('app:kue:update:limit_number_of_tasks');
module.exports = function () {
    logger.info('kue.js: Starting kue');
    var gettasks = function () {
        logger.info('kue.js: Getting tasks');
        var $deferred = $.Deferred();
        dbquery.task.oldest({olderthan: hours, limit: limit}).then(function (result) {
            if (result.error) {
                logger.error('kue.js: Error getting tasks list: %j', result.error);
                $deferred.reject(result);
            }
            if (result.data) {
                logger.info('kue.js: Got %d tasks to add to queue', result.data.length);
                $deferred.resolve(result);
            }
        });
        return $deferred.promise();
    };
    var createjobs = function (tasks) {
        logger.info('kue.js: Create jobs');
        tasks.forEach(function (val, idx, arr) {
            jobs.create('scrape', {title: 'Scrape: ' + val.url, selector: val.css, url: val.url}).save();
        });
    };
    var kuemanager = function () {
        jobs.activeCount(function (error, result) {
            if (error) logger.error('kue.js: jobs.activeCount: %j', error);
            logger.info('kue.js: jobs.activeCount: %d', result);
            if (result === 0) gettasks().then(function (result) {
                if (result.error) logger.error('kue.js: Error getting tasks: %j', result.error);
                if (result.data.length) createjobs(result.data);
            });
        });
    };
    jobs.on('complete', function () {
        logger.info('Job complete');
        kuemanager();
    })
    .on('failed', function () {
        logger.warn('Job failed');
    })
    .on('progress', function (progress) {
        logger.info('Job progress');
        //process.stdout.write('\r  job #' + job.id + ' ' + progress + '% complete');
    });
    kuemanager();
    setInterval(kuemanager, config.get('app:kue:update:interval'));
};