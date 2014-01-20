'use strict';
define(['jquery', 'socket', 'backbone'], function ($, socket) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['task-list/template'];
            socket.on('tasks', function (data) {
                console.log('data', data);
                view.render(data);
            });
        },
        render: function (data) {
            var view = this;
            view.$el.html(view.template({tasks: data.result}));
        }
    });
});