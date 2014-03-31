'use strict';
define(['jquery', 'socket', 'backbone'], function ($, socket) {
    return Backbone.View.extend({
        events: {
            'click .w-listitem': function (event) {
                var id = $(event.target).closest('.w-listitem').data('id');
                watchr.router.navigate('g/' + id, {trigger: true});
            }
        },
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['task-list/template'];
            socket.on('tasks', function (data) {
                console.log('recieved tasks', data);
                view.render(data);
            });
        },
        render: function (data) {
            var view = this;
            view.$el.html(view.template({tasks: data.result}));
        }
    });
});
