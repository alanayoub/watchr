'use strict';
define(['jquery', 'socket', '/collections/task.js', 'backbone'], function ($, socket, TaskCollection) {
    return Backbone.View.extend({
        events: {
            'click .w-listitem': function (event) {
                var id = $(event.target).closest('.w-listitem').data('id');
                watchr.router.navigate('g/' + id, {trigger: true});
            },
            'click .w-delete': function (event) {
                event.stopPropagation();
                var id = $(event.target).closest('.w-listitem').data('id');
                socket.emit('deletetask', id);
            }
        },
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['task-list/template'];
            view.collection = new TaskCollection();
            view.collection.comparator = function (model) {
                return -(new Date(model.get('asof')).getTime());
            };
            view.render();
            socket.on('task:update', function (data) {
                console.log('socket: task:update', data);
                view.collection.set(data[0], {remove: false});
            });
            socket.on('tasks', function (data) {
                console.log('socket: tasks', data);
                view.collection.set(data.result);
            });
            socket.on('taskdeleted', function (data) {
                console.log('socket: taskdeleted', data);
                if (data.error) return console.log('taskdeleted.error: ', data.error);
                var model = view.collection.get(data.id);
                view.collection.remove(model);
            });
            view.collection.on('change add remove', function () {
                view.render();
            });
        },
        render: function (data) {
            var view = this;
            view.$el.html(view.template({tasks: view.collection.toJSON()}));
        }
    });
});
