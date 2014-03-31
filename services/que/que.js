var $ = require('jquery'), logger = require('./../logger');
module.exports = function () {
    var que = this, backlog = [], process = {}, maxconcurrent = 2, inprogress = 0, retries = 3, purgatory = [];
    setInterval(function () {
        if (!backlog.length) return;
        logger.info('there is stuff in the backlog', backlog);
        backlog.forEach(function (val) {
            logger.info('status (max/inprogress)', maxconcurrent, inprogress);
            if (maxconcurrent <= inprogress) return;
            if (!val.inprogress) {
                process[val.type](
                    val.options, 
                    function () {
                        logger.info('this gets called when success');
                        que.job.del(val);
                    }, 
                    function () {
                        logger.info('this gets called when fail');
                        que.job.del(val);
                    }
                );
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
            var item = item;
            if (typeof item === 'number') {
                // getting object from id
                item = backlog.filter(function (val) {
                    logger.info('val', val);
                    return val.options.id === item
                })[0];
            }
            if (typeof item === 'object') {
                item.inprogress = true; // needed to match the backlog
                var index = backlog.indexOf(item);
                if (!!~index) backlog.splice(index, 1);
                logger.info('removing object');
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
            logger.info('creating process', type);
            process[type] = handler;
        }
    }
};
