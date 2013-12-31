var kue = require('kue'), jobs = kue.createQueue(), redis = require('redis'),
    config = require('../config'), logger = require('./logger'), $ = require('jquery');
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
    logger.info('starting kue');
    var taskleft = 0;
    var gettasks = function () {
        logger.info('getting tasks');
        var $deferred = $.Deferred();
        setTimeout(function () {
            $deferred.resolve([
                {url: 'http:', css: '.css'}, {url: 'http:', css: '.css'}, {url: 'http:', css: '.css'},
                {url: 'http:', css: '.css'}, {url: 'http:', css: '.css'}, {url: 'http:', css: '.css'},
                {url: 'http:', css: '.css'}, {url: 'http:', css: '.css'}, {url: 'http:', css: '.css'}
            ]);
        }, 500);
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
                    };
                })
                .on('failed', function () {
                    logger.warn('Job failed');
                    taskleft--;
                })
                .on('progress', function (progress) {
                    console.info('Job progress');
                    //process.stdout.write('\r  job #' + job.id + ' ' + progress + '% complete');
                });
        });
    };
    gettasks().then(function (result) {
        logger.info('got tasks, now create jobs');
        createjobs(result);
    });
};