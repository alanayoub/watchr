var winston = require('winston'), config = require('../config');
module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: config.get('logger:console:level'),
            colorize: true
        }),
        new (winston.transports.File)({
            filename: config.get('logger:file:filename'),
            maxsize: config.get('logger:file:maxsize'),
            maxFiles: config.get('logger:file:maxFiles'),
            level: config.get('logger:file:level')
        })
    ]
});