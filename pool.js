var config = require('./config');
module.exports = require('mysql').createPool({
    host: config.get('mysql:host'),
    user: config.get('mysql:user'),
    password: config.get('mysql:password'),
    connectionLimit: config.get('mysql:connectionLimit')
});
