var kue = require('kue'), jobs = kue.createQueue(),
    scraper = require('../scraper/scraper'),
    logger  = require('./../logger'),
    scrape_handler = require('../scraper/scrape_handler');
module.exports = function () {
    jobs.process('scrape', 1, function (job, done) {
        logger.info('Scraper job: j%', job.data);
        scraper(job.data).then(function (results) {
            scrape_handler({
                results: results,
                selector: job.data.selector,
                url: job.data.url
            }).then(done);
        });
    });
};