var pool = require('../../pool'), $ = require('jquery');
var common_query = function (query, values) {
    var $deferred = $.Deferred();
    pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(query, values, function (error, result) {
            if (error) $deferred.reject({error: error, message: ''});
            else $deferred.resolve({data: result});
        });
    });
    return $deferred.promise();
};
module.exports = {
    task: {
        exists: function (config) {
            var query = 'SELECT id FROM watchr.task WHERE css = ? AND url = ? ORDER BY id LIMIT 1',
                values = [config.selector, config.url];
            return common_query(query, values);
        },
        insert: function (config) {
            var query = 'INSERT INTO watchr.task (user_id, url, css) VALUES (?, ?, ?)',
                values = [config.id, config.url, config.css];
            return common_query(query, values);
        },
        first: function (config) {
            var query = 'SELECT * FROM watchr.task WHERE active = 1 AND creation_date < DATE_SUB(NOW(), INTERVAL ? HOUR) ORDER BY latest_scrape ASC LIMIT ?',
                values = [config.hours, config.amount];
            return common_query(query, values);
        }
    },
    result: {
        last: function (config) {
            var query = 'SELECT * FROM watchr.result WHERE task_id = ? ORDER BY asof DESC LIMIT ?',
                values = [config.task_id, config.amount];
            return common_query(query, values);
        },
        update: function (config) {
            var query = 'UPDATE watchr.result SET asof=now() WHERE id = ? AND value = ?',
                values = [config.id, config.value];
            return common_query(query, values);
        },
        insert: function (config) {
            var query = 'INSERT INTO watchr.result (task_id, value) VALUES (?, ?)',
                values = [config.task_id, config.value];
            return common_query(query, values);
        }
    }
};