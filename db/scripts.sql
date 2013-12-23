INSERT INTO watchr.user (username, password, salt, creation_date, uuid) VALUES ('alan', 'pass', 'somerandomsalt', now(), '_q8L62NkISFc4nR&J1ID!8pCFTJKr9QU');

SELECT * FROM watchr.user WHERE id = '2';

SELECT * FROM watchr.user WHERE username = 'alan' AND password = 'pass';

INSERT INTO watchr.user (username, password, salt, creation_date) VALUES ('alan', 'pass', 'somerandomsalt', now());

DELETE FROM watchr.user WHERE username = 'alan';

SET PASSWORD FOR 'alan'@'localhost' = PASSWORD('sdfaslkj&sdlkjklsdfjklj"$skldTfjsdklafuser');
