var $ = require('jquery'),
    phantom = require('node-phantom'),
    logger = require('../services/logger'),
    instances = [], max_scrapes_per_instance = 3, instanceid = 0;
module.exports = function () {
    logger.info('new phantom instance request received');
    var $deferred = $.Deferred(),
        instance, cloptions = {
            parameters: {
                'ignore-ssl-errors': true,
                'load-images': false
            }
        };
    /**
     * - Create a new phantomjs instance
     * - Add it to the instance array
     * - Pass a reference to the callback
     * @param callback
     */
    var newinstance = function (callback) {
        phantom.create(function (error, ph) {
            var id;
            if (error) return logger.error('Error creating Phantom instance %j', error);
            id = instances.push(ph);
            instance = instances[id-1];
            instance.watchr = {
                scraped: 0,
                scrapping: 0,
                instanceid: instanceid++
            };
            logger.info('Creating new phantomjs instance: %s', instance.watchr.instanceid);
            callback(error, instance);
        }, cloptions);
    };
    if (instances.length === 0) {
        newinstance(function (error, ph) {
            $deferred.resolve(error, ph);
        });
    }
    else {
        logger.info('Number of instances', instances.length);
        instances.every(function (val, idx) {
            if (val.watchr.scraped > max_scrapes_per_instance) {
                logger.info('Max scrapes for this instance, try another: %s', val.watchr.instanceid);
                logger.info('Killing instance %s', val.watchr.instanceid);
                instances.splice(idx, 1);
                val.exit();
                return true
            }
            else {
                logger.info('Found one with less than max scrapes: %s', val.watchr.instanceid);
                instance = val;
                return false
            };
        });
        if (!instance) {
            logger.info('No free instances found, need to create new instance');
            newinstance(function (error, ph) {
                logger.info('Number of scraped pages with this instance', instance.watchr.scraped);
                logger.info('Instance currently scraping', instance.watchr.scrapping);
                $deferred.resolve(error, ph);
            });
        }
        else {
            logger.info('Scraped pages with instance', instance.watchr.scraped);
            logger.info('Instance currently scraping', instance.watchr.scrapping);
            $deferred.resolve(false, instance);
        }
    }
    return $deferred.promise();
};