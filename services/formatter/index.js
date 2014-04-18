var logger = require('./../logger');
module.exports = function (data, type, regex) {
    if (regex && !type) {
        data.type = isNaN(data[0].value.replace(new RegExp(regex), "$1")) ? 'String' : 'Number';
    }
    if (!regex && !type) {
        data.type = isNaN(data[0].value) ? 'String' : 'Number';
    }
    if (type) data.type = type;
    if (data.type === 'Number') {
        return data.slice().reduce(function (acc, val) {
            if (!acc.type) acc.type = 'Number';
            val.asof = Date.parse(val.asof);
            acc.push([val.asof, val.value.replace(/[^\d]*([\d.]+)[^\d]*/, '$1')]);
            return acc;
        }, []);
    }
    if (!data.type || data.type === 'String') {
        return data;
    }
}