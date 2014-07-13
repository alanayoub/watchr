var validator = require('validator');
validator.extend('isCSSSelector', function (str) {
    var regex = new RegExp('^(([\:\.\~\#\-\*\_\[][^0-9])|^[a-z])([a-z0-9\s\<\>\[\]\"\'\:\.\+\~\#\-\_\=\(\)\^\$\|])*', 'i');
    return regex.test(str);
});

