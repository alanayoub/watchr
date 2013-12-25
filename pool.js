module.exports = require('mysql').createPool({
    host: 'localhost',
    user: 'alan',
    password: 'sdfaslkj&sdlkjklsdfjklj"$skldTfjsdklaf',
    connectionLimit: 10
});