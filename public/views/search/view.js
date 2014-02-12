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
                var data = $(this).serializeArray().reduce(function (acc, val) {
                    return (acc[val.name] = val.value) && acc;
                }, {});
                watchr.rest.search.post({data: data}).then(function (result) {
                    socket.emit('tasks');
                });
                event.preventDefault();
            });
        }
    });
});