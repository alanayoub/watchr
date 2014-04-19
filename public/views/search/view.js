'use strict';
define(['jquery', 'socket', 'backbone'], function ($, socket) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['search/template'];
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template());
            view.$el.find('.w-form').submit(function (event) {
                $(event.target).find('input[value=Add]').attr('disabled', 'disabled');
                var data = $(this).serializeArray().reduce(function (acc, val) {
                    if (!val.name || !val.value) return acc;
                    return (acc[val.name] = val.value) && acc;
                }, {});
                socket.emit('search', data);
                event.preventDefault();
            });
        }
    });
});
