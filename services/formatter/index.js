var logger = require('./../logger');
module.exports = function (data, type, regex) {
    var value = data[0].value;
    if (regex) value = value.replace(new RegExp(regex), "$1");
    if (!type) type = isNaN(value) ? 'String' : 'Number';
    data.type = type;
    if (data.type === 'Number') {
        return data.slice().reduce(function (acc, val) {
            if (!acc.type) acc.type = 'Number';
            val.asof = Date.parse(val.asof);
            acc.push([
                val.asof,
                regex ? val.value : val.value.replace(/[^\d]*([\d.]+)[^\d]*/, '$1') // if no regex use default regex
            ]);
            return acc;
        }, []);
    }
    if (!data.type || data.type === 'String') {
        return data;
    }
};