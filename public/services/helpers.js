'use strict';
define(['moment', 'util'], function (moment, util) {
    Handlebars.registerHelper('date', function (date, options) {
        return moment(date).format(options.hash.format || 'MMM Do, YYYY');
    });
});