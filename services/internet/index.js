var dns = require('dns'),
    logger = require('./../logger'),
    $ = require('jquery'),
    lastChecked,
    internet;
module.exports = function () {
    if (+new Date < lastChecked + (1000 * 5)) return internet;
    var $deferred = $.Deferred();
    dns.resolve('www.google.com', function (error) {
        logger.warn('dns error', error);
        lastChecked = +new Date;
        if (error) {
            dns.resolve('www.amazon.com', function (error) {
                if (error) internet = false;
                else internet = true;
                $deferred.resolve(internet);
            });
        }
        else $deferred.resolve(internet);
    });
    return $deferred.promise();
}

