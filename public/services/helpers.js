'use strict';
define(['moment'], function (moment) {
    Handlebars.registerHelper('date', function (date, options) {
        return moment(date).format(options.hash.format || 'MMM Do, YYYY');
    });
});
