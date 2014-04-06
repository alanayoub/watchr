'use strict';
define(['jquery', 'socket', '/collections/task.js', 'backbone'], function ($, socket, TaskCollection) {
    return Backbone.View.extend({
        events: {
            'click .w-listitem': function (event) {
                var id = $(event.target).closest('.w-listitem').data('id');
                watchr.router.navigate('g/' + id, {trigger: true});
            }
        },
        initialize: function () {
            var view = this;
            view.collection = new TaskCollection();
            view.collection.comparator = function(model) {
                return -(new Date(model.get('asof')).getTime());
            };
            view.template = Handlebars.templates['task-list/template'];
            socket.on('task:update', function (data) {
                view.collection.set(data[0], {remove: false});
            });
            socket.on('tasks', function (data) {
                view.collection.set(data.result);
            });
            view.collection.on('change add', function () {
                view.render();
            });
        },
        render: function (data) {
            var view = this;
            view.$el.html(view.template({tasks: view.collection.toJSON()}));
        }
    });
});
