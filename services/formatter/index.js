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
            var newval = regex
                ? val.value.replace(new RegExp(regex), "$1")
                : val.value.replace(/[^\d]*([\d.]+)[^\d]*/, '$1'); // default Number regex
            acc.push([val.asof, newval]);
            return acc;
        }, []);
    }
    if (!data.type || data.type === 'String') {
        // regular expression currently not applied to type string
        return data;
    }
};