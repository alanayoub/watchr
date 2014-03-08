var $ = require('jquery'), logger = require('./../logger');
module.exports = function () {
    var que = this, backlog = [], process = {}, maxconcurrent = 2, inprogress = 0, retries = 3, purgatory = [];
    setInterval(function () {
        if (!backlog.length) return;
        logger.info('there is stuff in the backlog', backlog);
        backlog.forEach(function (val) {
            logger.info('status', maxconcurrent, inprogress);
            if (maxconcurrent <= inprogress) return;
            if (!val.inprogress) {
                process[val.type](val.options, function () {
                    logger.info('this gets called when done');
                    que.job.del(val);
                    inprogress--;
                });
                val.inprogress = true;
                inprogress++;
            }
        })
    }, 2000);
    que.job = {
        add: function (type, options) {
            logger.info('adding job');
            backlog.push({type: type, options: options});
        },
        del: function (item) {
            if (typeof item === 'number') {
                logger.info('is number');
                backlog.splice(item, 1);
                return backlog;
            }
            if (typeof item === 'object') {
                var index = backlog.indexOf(item);
                if (!!~index) backlog.splice(index, 1);
                logger.info('removing object');
            }
        },
        get: function () {
            return backlog;
        }
    };
    que.process = {
        add: function (type, handler) {
            logger.info('creating process', type);
            process[type] = handler;
        }
    }
};
