var logger = require('./../logger');
module.exports = function (data, type) {
    if (type === 'Number') {
        return data.slice().reduce(function (acc, val) {
            val.asof = Date.parse(val.asof);
            acc.push([val.asof, val.value.replace(/[^\d]*([\d.]+)[^\d]*/, '$1')]);
            return acc;
        }, []);
    }
    if (!type || type === 'String') {
        return data.slice().reduce(function (acc, val) {
            val.asof = Date.parse(val.asof);
            acc.push([val.asof, val.value]);
            return acc;
        }, []);
    }
}