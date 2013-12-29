var $ = require('jquery'), phantom = require('node-phantom'),
    instances = [], max_scrapes_per_instance = 3, instanceid = 0;
module.exports = function () {
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
            if (error) return console.log('Error creating Phantom instance %j'.red, error);
            id = instances.push(ph);
            instance = instances[id-1];
            instance.watchr = {
                scraped: 0,
                scrapping: 0,
                instanceid: instanceid++
            };
            console.log('Creating new phantomjs instance: %s'.blue, instance.watchr.instanceid);
            callback(error, instance);
        }, cloptions);
    };
    if (instances.length === 0) {
        newinstance(function (error, ph) {
            $deferred.resolve(error, ph);
        });
    }
    else {
        console.log('Number of instances'.blue, instances.length);
        instances.every(function (val, idx) {
            if (val.watchr.scraped > max_scrapes_per_instance) {
                console.log('Max scrapes for this instance, try another: %s'.blue, val.watchr.instanceid);
                console.log('Killing instance %s'.blue, val.watchr.instanceid);
                instances.splice(idx, 1);
                val.exit();
                return true
            }
            else {
                console.log('Found one with less than max scrapes: %s'.blue, val.watchr.instanceid);
                instance = val;
                return false
            };
        });
        if (!instance) {
            console.log('No free instances found, need to create new instance'.blue);
            newinstance(function (error, ph) {
                console.log('Number of scraped pages with this instance'.blue, instance.watchr.scraped);
                console.log('Instance currently scraping'.blue, instance.watchr.scrapping);
                $deferred.resolve(error, ph);
            });
        }
        else {
            console.log('Scraped pages with instance'.blue, instance.watchr.scraped);
            console.log('Instance currently scraping'.blue, instance.watchr.scrapping);
            $deferred.resolve(false, instance);
        }
    }
    return $deferred.promise();
};