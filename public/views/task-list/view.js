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
                console.log('task:update', data);
                view.collection.set(data[0], {remove: false});
            });
            socket.on('tasks', function (data) {
                console.log('tasks', data);
                view.collection.set(data.result);
            });
            socket.on('taskdeleted', function (data) {
                if (data.error) return console.log('taskdeleted.error: ', data.error);
                var model = view.collection.get(data.id);
                view.collection.remove(model);
            });
            socket.on('svr:task:new', function (data) {
                console.log('svr:task:new', data);
                watchr.router.navigate('g/' + data.id, {trigger: true});
            });
            socket.on('svr:scrape:task', function (data) {
                console.log('svr:task:task', data);
                view.collection.set(data, {remove: false});
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
