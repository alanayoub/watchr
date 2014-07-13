var logger  = require('../services/logger'),
    scraper = require('../services/scraper/scraper'),
    scrape_handler = require('../services/scraper/scrape_handler');
app.post('/api/search', function (req, res) {
    logger.info('POST: %j'.green, req.body);
    var body = req.body;
    if (!(body.url && body.selector)) return; // TODO: send some error
    scraper(req.body).then(
        function (result) {
            console.log(' ------------------------------------------ is this file being used');
            if (result.error) {
                logger.error(__filename, ': Scraping : %j', result.error);
                throw result.error;
            }
            logger.info(__filename, ': Scrape successful');
            res.send(result);
            logger.info(__filename, ': Calling scrape handler');
            return
            scrape_handler.handle({
                results: result,
                selector: body.selector,
                url: body.url,
                title: body.title || 'Untitled',
                user_id: req.user.id
            });
        }, 
        function (error) {
            if (error.type === 'dnserror') return; // no internet
        }
    );
});
