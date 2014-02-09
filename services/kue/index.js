var config = require('../../config'),
    logger  = require('./../logger'),
    dbquery = require('../../db/query'),
    scraper = require('../scraper/scraper'),
    scrape_handler = require('../scraper/scrape_handler'),
    hours = config.get('app:kue:update:tasks_older_than_x_hours'),
    limit = config.get('app:kue:update:limit_number_of_tasks');

var kue = require('kue'), jobs = kue.createQueue(),
    scraper = require('../scraper/scraper'),
    logger  = require('./../logger'),
    scrape_handler = require('../scraper/scrape_handler');




var JobsList = function () {
    var jobs = this,
        backlog = [],
        working = [],
        interval = 1000,
        active_workers = 0, total_workers = 2;
    setInterval(function () {
        if (active_workers < total_workers) {
            console.log('do jobs', cache);
            working.push(backlog.shift());
        }
        working.forEach(function (val) {
            if (!val.working) {
                console.log('initiate job');
                val.working = true;
            }
        })
    }, interval);
    jobs.get = function () {}
    jobs.new = function (type, options) {
        backlog.push({type: type, options: options});
        console.log('creating new jobs', type, options);
    }
}

var gettasks = function () {
    return tasks;
}

var createjobs = function (tasks) {
   tasks.forEach(function (val) {job.create(val)})
}

var tasks = new TaskList();
var jobs = new JobsList();















var TaskList = function () {
    var tasks = this,
        cache = [];
    tasks.get = function () {
        return cache;
    };
    tasks.set = function (task) {
        cache.push(task);
    };
    tasks.del = function (item) {
        if (typeof item === 'number') {
            console.log('is number');
            cache.splice(item, 1);
            return cache;
        }
        if (typeof item === 'object') {
            console.log('ob');
        }
    }
};

var jobs = new TaskList();

scraper(job.data).then(function (results) {
    scrape_handler({
        results: results,
        selector: job.data.selector,
        url: job.data.url
    }).then(done);
});

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

gettasks().then(function (result) {
    if (result.error) logger.error('kue.js: Error getting tasks: %j', result.error);
    if (result.data.length) createjobs(result.data);
});

var createjobs = function (tasks) {
    logger.info('kue.js: Create jobs');
    tasks.forEach(function (val, idx, arr) {
        var options = {title: 'Scrape: ' + val.url, selector: val.css, url: val.url};
        jobs.set('scrape', options).attempts(5).save();
    });
};

// check for tasks
// create scrap jobs
// do jobs
//var tasks = [], jobs = [], processes = [];

//
//var tasks = new TaskList();
//var jobs = new TaskList();
//var processes = new TaskList();
//tasks.set({name: 'something'});
//tasks.set({name: 'blah'});
//tasks.set({name: 'test'});
//tasks.set({name: 'yo'});
//
//var task_manager = function () {
//    tasks.get().forEach(function (val) {
//        console.log('tasks', val);
//        jobs.set({type: 'scraper', options: val});
//    });
//    console.log('task_manager');
//};
//
//setInterval(function () {
//    task_manager();
//}, 10000);
//
//task_manager();
//
//var get_tasks = function () {
//    logger.info('kue.js: Getting tasks');
//    var $deferred = $.Deferred();
//    dbquery.task.oldest({olderthan: hours, limit: limit}).then(function (result) {
//        if (result.error) {
//            logger.error('kue.js: Error getting tasks list: %j', result.error);
//            $deferred.reject(result);
//        }
//        if (result.data) {
//            logger.info('kue.js: Got %d tasks to add to queue', result.data.length);
//            $deferred.resolve(result);
//        }
//    });
//    return $deferred.promise();
//};
//
//var Q = function (fetch) {
//    var tasks = [], jobs = [], process = [];
//    return {
//        sync: function (fetch) {
//            if (!tasks.length) {
//                fetch().then(function (tasks) {
//                   tasks.push(tasks);
//                });
//            }
//        },
//        process: function (type, job) {
//            var p = {};
//            p[type] = job;
//            process.push(p);
//        },
//        job: {
//            create: function () {
//            }
//        }
//    }
//};
//
//var q = new Q(function () {
//    get_tasks();
//    console.log('get tasks');
//});
//q.sync();
//q.process('scrape', function (job, done) {
//    logger.info('Scraper job: j%', job.data);
//    scraper(job.data).then(function (results) {
//        scrape_handler({
//            results: results,
//            selector: job.data.selector,
//            url: job.data.url
//        }).then(done);
//    });
//});
//q.job.create('scrape', function () {
//    console.log('scrapping stuff');
//});
//q.on('complete', function () {
//    console.log('job complete');
//    q.sync();
//});
//q.on('fail', function () {
//    console.log('doh job failed');
//    q.sync();
//});