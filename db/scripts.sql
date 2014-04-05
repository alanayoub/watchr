/* USER */
INSERT INTO watchr.user (username, password, salt, creation_date, uuid) VALUES ('alan', 'pass', 'somerandomsalt', now(), '_q8L62NkISFc4nR&J1ID!8pCFTJKr9QU');
SELECT * FROM watchr.user WHERE id = '2';
SELECT * FROM watchr.user WHERE username = 'alan' AND password = 'pass';
INSERT INTO watchr.user (username, password, salt, creation_date) VALUES ('alan', 'pass', 'somerandomsalt', now());

/* TASK */
DELETE FROM watchr.task WHERE id = 3;
INSERT INTO watchr.task (user_id, url, css, xpath, creation_date) VALUES (1, 'http://google.com', '#interestingId', '', now());
SELECT url, css, xpath, latest_scrape FROM watchr.task WHERE user_id = 1 ORDER BY creation_date DESC;
SELECT EXISTS(SELECT * FROM watchr.task WHERE css = '#interestingId' AND url = 'http://google.com');
SELECT id FROM watchr.task WHERE css = '.someval' AND url = 'https://www.google.com/' ORDER BY id LIMIT 1;
SELECT * FROM watchr.task;
SELECT type FROM watchr.task WHERE id = 5;

SELECT * FROM watchr.task 
    WHERE active = 1 
    AND (watchr.task.failed IS NULL OR watchr.task.failed != 1) 
    AND latest_scrape < date_sub(now(), INTERVAL 1 HOUR) 
    ORDER BY latest_scrape 
    ASC LIMIT 999;

UPDATE watchr.task SET failed = 0 WHERE id = 5;
SELECT * FROM watchr.task WHERE watchr.task.failed is null or watchr.task.failed != 1;

SELECT * FROM (
    SELECT watchr.task.url, watchr.task.creation_date, watchr.task.title, watchr.task.type, watchr.result.*
    FROM watchr.result
    LEFT JOIN watchr.task
    ON watchr.task.id=watchr.result.task_id
    WHERE (watchr.task.user_id = 1) AND (watchr.task.failed != 1 OR watchr.task.failed IS NULL) AND (watchr.task.id LIKE '%')
) AS tmp
WHERE id IN (SELECT MAX(id) FROM watchr.result GROUP BY task_id)
ORDER BY creation_date DESC;

/* LOGIN ATTEMPT */
INSERT INTO watchr.login_attempt (username, ip, browser, success) VALUES ('alan@dfs.com', '19.1.1.1', 'Interweb Explorer', 0);
SELECT * FROM watchr.login_attempt;

/* RESULT */
INSERT INTO watchr.result (task_id, value) VALUES ('4', 'somevalue');
SELECT 1 FROM watchr.result WHERE task_id = 4 AND value = 'somevalue' ORDER BY id LIMIT 1;
SELECT * FROM watchr.result;
UPDATE watchr.result SET asof=now() WHERE task_id = 4 AND value = '';
SELECT * FROM watchr.result WHERE task_id = 9 ORDER BY asof DESC LIMIT 1;
SELECT * FROM watchr.result WHERE task_id = 19 ORDER BY asof DESC;
SELECT * FROM watchr.result;

SET PASSWORD FOR 'root'@'localhost' = PASSWORD('sdfaslkjsdlkjklsdfjkljskldTfjsdklafuser');
ALTER TABLE watchr.task ADD UNIQUE INDEX(user_id, url, css, xpath);

