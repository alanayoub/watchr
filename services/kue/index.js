var kue = require('kue'),
    redis = require('redis'),
    config = require('../../config'),
    logger  = require('./../logger');
kue.redis.createClient = function () {
    var client = redis.createClient(config.get('redis:port'), config.get('redis:host'));
    client.auth(config.get('redis:pass'));
    return client;
};
(function () {
    /**
     * Clear redis Kue tasks on startup
     */
    var client = redis.createClient(config.get('redis:port'), config.get('redis:host'));
    client.keys('q:*', function (error, keys) {
            if (error) return logger.error('Fetching q:*');
            keys.forEach(function (key, pos) {
                client.del(key, function (err, result) {
                    logger.warn('DEL ARGS', key, err, result);
                });
            });
        });
    client.end();
})();
require('./kue_processes')();
require('./kue_jobs')();
kue.app.listen(config.get('kue:ui:port'));
