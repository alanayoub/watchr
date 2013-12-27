var nconf = require('nconf'),
    environment = nconf.get('NODE:ENV') || 'development';
nconf.file(environment, 'config/' + environment + '.json');
nconf.file('default', 'config/default.json');
module.exports = {
    get: function (key) {
        return nconf.get(key);
    }
};