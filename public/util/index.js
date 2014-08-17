define([], function () {
    'use strict';
    return {
        format_currency: function (number) {
            return Number(number).toLocaleString('en');
        }
    };
});
