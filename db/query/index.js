var $ = require('jquery'),
    pool = require('../../pool'),
    logger = require('../../services/logger');
var common_query = function (query, values) {
    var $deferred = $.Deferred();
    pool.getConnection(function (error, connection) {
        if (error) {
            logger.error('getting connection error', error);
            throw error;
        }
        connection.query(query, values, function (error, result) {
            connection.release();
            if (error) $deferred.reject({error: error, message: ''});
            else $deferred.resolve({data: result});
        });
    });
    return $deferred.promise();
};
module.exports = {
    task: {
        /**
         * Check if task exists
         */
        exists: function (config) {
            var query = '\
                SELECT id \
                FROM watchr.task \
                WHERE css = ? \
                      AND url = ? \
                ORDER BY id LIMIT 1',
                values = [config.selector, config.url];
            return common_query(query, values);
        },
        /**
         * Get all or just one task for display
         */
        getDisplayTasks: function (config) {
            var query = '\
                SELECT * \
                FROM (SELECT watchr.task.url, \
                             watchr.task.creation_date, \
                             watchr.task.title, \
                             watchr.task.type, \
                             watchr.result.* \
                      FROM   watchr.result \
                             LEFT JOIN watchr.task \
                                    ON watchr.task.id=watchr.result.task_id \
                      WHERE (watchr.task.user_id = ?) \
                             AND (watchr.task.failed != 1 OR watchr.task.failed IS NULL) \
                             AND (watchr.task.id LIKE ?) \
                             AND (watchr.task.active = 1)) AS tmp \
                WHERE id IN (SELECT MAX(id) \
                             FROM watchr.result \
                             GROUP BY task_id)\
                ORDER BY creation_date DESC;',
                values = [config.user_id, config.task_id || '%'];
            return common_query(query, values);
        },
        getOneTask: function (config) {
            var query = '\
                SELECT title, url, regex, css, xpath, latest_scrape, type \
                FROM watchr.task \
                WHERE id = ? \
                ORDER BY creation_date DESC',
                values = [config.id];
            return common_query(query, values);
        },
        getScrapeTasks: function (config) {
            var query = '\
                SELECT * \
                FROM watchr.task \
                WHERE active = 1 \
                      AND (watchr.task.failed IS NULL OR watchr.task.failed !=1) \
                      AND latest_scrape < DATE_SUB(NOW(), INTERVAL ? MINUTE) \
                ORDER BY latest_scrape \
                ASC LIMIT ?',
                values = [config.olderthan || 0, config.limit];
            return common_query(query, values);
        },
        new: function (config) {
            var query = '\
                INSERT INTO watchr.task (user_id, title, url, css, latest_scrape) \
                VALUES (?, ?, ?, ?, now())',
                values = [config.id, config.title, config.url, config.css];
            return common_query(query, values);
        },
        updateTimestamp: function (config) {
            var query = '\
                UPDATE watchr.task \
                SET latest_scrape=now() \
                WHERE id = ?',
                values = [config.id];
            return common_query(query, values);
        },
        updateType: function (config) {
            var query = '\
                UPDATE watchr.task \
                SET type = ? \
                WHERE id = ? \
                      AND user_id = ?',
                values = [config.value, config.id, config.user_id];
            return common_query(query, values);
        },
        updateRegex: function (config) {
            var query = '\
                UPDATE watchr.task \
                SET regex = ? \
                WHERE id = ?',
                values = [config.value, config.id];
            return common_query(query, values);
        },
        updateFailed: function (config) {
            var query = '\
                UPDATE watchr.task \
                SET failed = ? \
                WHERE id = ?',
                values = [config.value, config.id];
            return common_query(query, values);
        },
        updateActive: function (config) {
            var query = '\
                UPDATE watchr.task \
                SET active = ? \
                WHERE id = ?',
                values = [config.value, config.id];
            return common_query(query, values);
        }
    },
    result: {
        /**
         * Get the results for the TASK with ID x
         */
        get: function (config) {
            var query = '\
                SELECT * \
                FROM watchr.result \
                WHERE task_id = ? \
                ORDER BY asof DESC \
                LIMIT ?',
                values = [config.task_id, config.limit || 999999999];
            return common_query(query, values);
        },
        new: function (config) {
            var query = '\
                INSERT INTO watchr.result (task_id, value) \
                VALUES (?, ?)',
                values = [config.task_id, config.value];
            return common_query(query, values);
        },
        update: function (config) {
            var query = '\
                UPDATE watchr.result \
                SET asof=now() \
                WHERE id = ? \
                      AND value = ?',
                values = [config.id, config.value];
            return common_query(query, values);
        }
    },
    user: {
        get: function (config) {
            var query = '\
                SELECT * \
                FROM watchr.user \
                WHERE uuid = ?',
                values = [config.uuid];
            return common_query(query, values);
        },
        authenticate: function (config) {
            var query = '\
                SELECT * \
                FROM watchr.user \
                WHERE username = ? \
                      AND password = ? \
                      AND confirmed = 1 \
                      AND active = 1',
                values = [config.username, config.password];
            return common_query(query, values);
        },
        newGoogleUser: function (config) {
            var query = '\
                INSERT INTO watchr.user (username, password, salt, creation_date, uuid, active, confirmed) \
                VALUES (?, "Google", "somerandomsalt", now(), ?, 1, 1)',
                values = [config.username, config.uuid];
            return common_query(query, values);
        }
    }
};
