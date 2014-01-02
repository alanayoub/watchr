var logger  = require('../services/logger'),
    scraper = require('../scraper'),
    scrape_handler = require('../services/scrape_handler');
app.post('/api/search', function (req, res) {
    logger.info('POST: %j'.green, req.body);
    var body = req.body;
    if (!(body.url && body.selector)) return; // TODO: send some error
    scraper(req.body).then(function (result) {
        if (result.error) {
            logger.error('Error scraping %j', result.error);
            throw result.error;
        }
        res.send(result);
        scrape_handler({
            results: result,
            selector: body.selector,
            url: body.url,
            user_id: req.user.id
        });
    });
});