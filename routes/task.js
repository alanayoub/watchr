var dbquery = require('../db/query'), logger = require('../services/logger');
app.get('/api/task', function (req, res) {
    logger.info('api task request');
    // move the query to somewhere common
    dbquery.task.user({user_id: req.user.id}).then(function (result) {
        if (result.error) {
            logger.error('Error getting user tasks %j', result.error);
            throw result.error;
        }
        if (result.data) res.send({result: result.data});
    });
});
app.get('/api/task/:id', function (req, res) {
    logger.info('api task/id request');
    dbquery.task.user({user_id: req.user.id, id: req.params.id}).then(function (result) {
        if (result.error) {
            logger.error('Error getting user tasks %j', result.error);
            throw result.error;
        }
        if (result.data) res.send({result: result.data});
    });
});