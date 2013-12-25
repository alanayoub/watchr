var scraper = require('../scraper');
app.post('/api/search', function (req, res) {
    console.log('POST: %j'.green, req.body);
    scraper.scraper(req.body, function (result) {
        console.log('Result: %s'.green, result);
        res.send(result);
    });
});