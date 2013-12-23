var banned = [];
module.exports = function () {
    return function (req, res, next) {
        if (banned.indexOf(req.connection.remoteAddress) > -1) res.end('Banned');
        else next();
    }
};