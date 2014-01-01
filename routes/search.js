var $       = require('jquery'),
    dbquery = require('../db/query'),
    logger  = require('../services/logger'),
    pool    = require('../pool'),
    scraper = require('../scraper');
app.post('/api/search', function (req, res) {
    logger.info('POST: %j'.green, req.body);
    var body = req.body;
    if (!(body.url && body.selector)) return; // TODO: send some error
    $.when(
        scraper(req.body),
        dbquery.task.exists({selector: body.selector, url: body.url})
    ).then(function (scrape_results, task_results) {
        res.send(scrape_results);
        var task_id;
        if (task_results.error) {
            logger.error('Error getting tasks %j', task_results.error);
            throw task_results.error;
        }
        if (scrape_results.error) {
            logger.error('Error scraping %j', scrape_results.error);
            throw scrape_results.error;
        }
        if (task_results.data.length) {
            task_id = task_results.data[0].id;
            dbquery.result.last({task_id: task_id, limit: 1}).then(function (result) {
                if (result.error) throw result.error;
                if (result.data[0].value === scrape_results) {
                    dbquery.result.update({id: result.data[0].id, value: scrape_results});
                }
                else {
                    dbquery.result.insert({task_id: task_id, value: scrape_results});
                }
            });
        }
        else dbquery.task.insert({id: req.user.id, url: body.url, css: body.selector}).then(function (result) {
            if (result.error) throw result.error;
            dbquery.result.insert({task_id: result.data.insertId, value: scrape_results});
        });
    });
});