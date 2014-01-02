var kue = require('kue'),
    redis = require('redis'),
    config = require('../../config');
kue.redis.createClient = function () {
    var client = redis.createClient(config.get('redis:port'), config.get('redis:host'));
    client.auth(config.get('redis:pass'));
    return client;
};
require('./kue_processes')();
require('./kue_jobs')();
kue.app.listen(config.get('kue:ui:port'));
