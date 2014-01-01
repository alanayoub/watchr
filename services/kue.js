var $       = require('jquery'),
    dbquery = require('../db/query'),
    config  = require('../config'),
    kue     = require('kue'),
    jobs    = kue.createQueue(),
    logger  = require('./logger'),
    redis   = require('redis');
var total_tasks_complete = 0;
kue.redis.createClient = function () {
    var client = redis.createClient(config.get('redis:port'), config.get('redis:host'));
    client.auth(config.get('redis:pass'));
    return client;
};
jobs.process('scrape', 3, function (job, done) {
    setTimeout(function () {
        done();
    }, 3000);

});
module.exports = function () {
    logger.info('kue.js: Starting kue');
    var taskleft = 0;
    var gettasks = function () {
        logger.info('kue.js: Getting tasks');
        var $deferred = $.Deferred();
        dbquery.task.oldest({limit: 5}).then(function (result) {
            logger.info('oldest returned:', result);
            if (result.error) {
                logger.error('kue.js: Error getting tasks list: %j', result.error);
                $deferred.reject(result.error);
            }
            if (result.data) {
                logger.info('kue.js: Got %d tasks to add to queue', result.data.length);
                $deferred.resolve(result.data);
            }
        });
        return $deferred.promise();
    };
    var createjobs = function (tasks) {
        tasks.forEach(function (val, idx, arr) {
            taskleft++;
            jobs
                .create('scrape', {
                    title: 'Scrape url'
                    , css: val.css
                    , url: val.url
                })
                .save()
                .on('complete', function () {
                    taskleft--;
                    total_tasks_complete++;
                    logger.info('Job complete %d left, total %d', taskleft, total_tasks_complete);
                    if (taskleft < 1) {
                        logger.info('Get more tasks and start again');
                        gettasks().then(function (result) {
                            createjobs(result);
                        });
                    }
                })
                .on('failed', function () {
                    logger.warn('Job failed');
                    taskleft--;
                })
                .on('progress', function (progress) {
                    logger.info('Job progress');
                    //process.stdout.write('\r  job #' + job.id + ' ' + progress + '% complete');
                });
        });
    };
    gettasks().then(function (result) {
        logger.info('kue.js: Got tasks, now create jobs');
        createjobs(result);
    });
};