var $ = require('jquery'),
    pool = require('../../pool'),
    config = require('../../config'),
    logger = require('../../services/logger');
var common_query = function (query, values) {
    var $deferred = $.Deferred(),
        regex = new RegExp('database', 'g');
    pool.getConnection(function (error, connection) {
        if (error) {
            logger.error('getting connection error', error);
            throw error;
        }
        query = query.replace(regex, config.get('mysql:database'));
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
                FROM database.task \
                WHERE css = ? \
                      AND url = ? \
                      AND user_id = ? \
                ORDER BY id LIMIT 1',
                values = [config.css, config.url, config.user_id];
            return common_query(query, values);
        },
        /**
         * Get all or just one task for display
         */
        getDisplayTasks: function (config) {
            var query = '\
                SELECT * \
                FROM (SELECT database.task.url, \
                             database.task.creation_date, \
                             database.task.title, \
                             database.task.type, \
                             database.task.failed, \
                             database.result.* \
                      FROM   database.result \
                             LEFT JOIN database.task \
                                    ON database.task.id=database.result.task_id \
                      WHERE (database.task.user_id = ?) \
                             /*AND (database.task.failed != 1 OR database.task.failed IS NULL)*/ \
                             AND (database.task.id LIKE ?) \
                             AND (database.task.active = 1)) AS tmp \
                WHERE id IN (SELECT MAX(id) \
                             FROM database.result \
                             GROUP BY task_id)\
                ORDER BY creation_date DESC;',
                values = [config.user_id, config.task_id || '%'];
            return common_query(query, values);
        },
        getOneTask: function (config) {
            var query = '\
                SELECT title, url, regex, css, xpath, latest_scrape, type, failed \
                FROM database.task \
                WHERE id = ? \
                ORDER BY creation_date DESC',
                values = [config.id];
            return common_query(query, values);
        },
        getScrapeTasks: function (config) {
            var query = '\
                SELECT * \
                FROM database.task \
                WHERE active = 1 \
                      AND (database.task.failed IS NULL OR database.task.failed !=1) \
                      AND latest_scrape < DATE_SUB(NOW(), INTERVAL ? MINUTE) \
                ORDER BY latest_scrape \
                ASC LIMIT ?',
                values = [config.olderthan || 0, config.limit];
            return common_query(query, values);
        },
        new: function (config) {
            var query = '\
                INSERT INTO database.task (user_id, title, url, css, latest_scrape) \
                VALUES (?, ?, ?, ?, now())',
                values = [config.id, config.title, config.url, config.css];
            return common_query(query, values);
        },
        updateTimestamp: function (config) {
            var query = '\
                UPDATE database.task \
                SET latest_scrape=now() \
                WHERE id = ?',
                values = [config.id];
            return common_query(query, values);
        },
        updateType: function (config) {
            var query = '\
                UPDATE database.task \
                SET type = ? \
                WHERE id = ? \
                      AND user_id = ?',
                values = [config.value, config.id, config.user_id];
            return common_query(query, values);
        },
        updateRegex: function (config) {
            var query = '\
                UPDATE database.task \
                SET regex = ? \
                WHERE id = ?',
                values = [config.value, config.id];
            return common_query(query, values);
        },
        updateFailed: function (config) {
            var query = '\
                UPDATE database.task \
                SET failed = ? \
                WHERE id = ?',
                values = [config.value, config.id];
            return common_query(query, values);
        },
        updateActive: function (config) {
            var query = '\
                UPDATE database.task \
                SET active = ? \
                WHERE id = ?',
                values = [config.value, config.id];
            return common_query(query, values);
        },
        updateDetails: function (config) {
            var query = '\
                UPDATE database.task \
                SET title = ?, css = ?, url = ? \
                WHERE id = ? \
                      AND user_id = ?',
                values = [config.title, config.css, config.url, config.id, config.user_id];
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
                FROM database.result \
                WHERE task_id = ? \
                ORDER BY asof DESC \
                LIMIT ?',
                values = [config.task_id, config.limit || 999999999];
            return common_query(query, values);
        },
        new: function (config) {
            var query = '\
                INSERT INTO database.result (task_id, value) \
                VALUES (?, ?)',
                values = [config.task_id, config.value];
            return common_query(query, values);
        },
        update: function (config) {
            var query = '\
                UPDATE database.result \
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
                FROM database.user \
                WHERE uuid = ?',
                values = [config.uuid];
            return common_query(query, values);
        },
        authenticate: function (config) {
            var query = '\
                SELECT * \
                FROM database.user \
                WHERE username = ? \
                      AND password = ? \
                      AND confirmed = 1 \
                      AND active = 1',
                values = [config.username, config.password];
            return common_query(query, values);
        },
        newGoogleUser: function (config) {
            var query = '\
                INSERT INTO database.user (username, password, salt, creation_date, uuid, active, confirmed) \
                VALUES (?, "Google", "somerandomsalt", now(), ?, 1, 1)',
                values = [config.username, config.uuid];
            return common_query(query, values);
        }
    },
    login_attempt: {
        new: function (config) {
            var query = '\
                INSERT INTO database.login_attempt (username, ip, success, user_uuid)\
                VALUES (?, ?, ?, ?)',
                values = [config.username, config.ip, config.success, config.user_uuid];
            return common_query(query, values);
        }
    },
    botnet: {
        // Check if a non confirmed value already exists for a task
        checkExists: function (config) {
            var query = '\
                SELECT * FROM database.botnet \
                WHERE task_id = ? \
                      AND confirmed IS NULL',
            values = [config.task_id];
            return common_query(query, values);
        },
        // Insert new initial value to be confirmed
        insertInit: function (config) {
            var query = '\
                INSERT INTO database.botnet (value, valueon, valueby, task_id) \
                VALUES (?, now(), ?, ?)',
                values = [config.value, config.valueby, config.task_id];
            return common_query(query, values);
        },
        // Confirm existing value
        insertConfirm: function (config) {
            var query = '\
                UPDATE database.botnet SET value2=?, value2on=now(), value2by=?, confirmed=? \
                WHERE task_id = ? \
                AND confirmed IS NULL',
                values = [config.value, config.valueby, config.confirmed, config.task_id];
            return common_query(query, values);
        }
    }
};
