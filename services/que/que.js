var $ = require('jquery'), 
    logger = require('./../logger'),
    util = require('util'),
    events = require('events');

var Que = module.exports = function () {
    events.EventEmitter.call(this);
    var que = this, backlog = [], process = {}, maxconcurrent = 2, inprogress = 0, retries = 3, purgatory = [];
    setInterval(function () {
        if (!backlog.length) return;
        logger.info(__filename, 'There is stuff in the backlog', backlog);
        backlog.forEach(function (val) {
            logger.info(__filename, 'Status (max/inprogress)', maxconcurrent, inprogress);
            if ((+new Date - val.inprogress) > 60 * 1000) que.job.del(val);
            if (maxconcurrent <= inprogress) return;
            if (!val.inprogress) {
                process[val.type](
                    val.options, 
                    function () {
                        logger.info(__filename, 'This gets called when success');
                        que.job.del(val);
                    }, 
                    function () {
                        logger.info(__filename, 'This gets called when fail');
                        que.job.del(val);
                    }
                );
                val.inprogress = +new Date;
                inprogress++;
            }
        })
    }, 2000);
    que.job = {
        add: function (type, options) {
            logger.info(__filename, 'que.job.add');
            backlog.push({type: type, options: options});
        },
        del: function (item) {
            var item = item;
            if (typeof item === 'number') {
                // getting object from id
                item = backlog.filter(function (val) {
                    logger.info(__filename, 'que.job.del', val);
                    return val.options.id === item
                })[0];
            }
            if (typeof item === 'object') {
                item.inprogress = true; // needed to match the backlog
                var index = backlog.indexOf(item);
                if (!!~index) backlog.splice(index, 1);
                logger.info(__filename, 'que.job.del', item);
            }
            inprogress--;
            return backlog;
        },
        get: function () {
            return backlog;
        }
    };
    que.process = {
        add: function (type, handler) {
            logger.info(__filename, 'que.process.add: ', type);
            process[type] = handler;
        }
    }
    return que;
}

util.inherits(Que, events.EventEmitter);
