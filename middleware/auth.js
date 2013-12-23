module.exports = function () {
    return function (req, res, next) {
        if (req.user || !/^\/api\//.test(req.url) || req.url === '/api/login') next();
        else {
            res.statusCode = 401;
            res.end();
        };
    };
};