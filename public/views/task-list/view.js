'use strict';
define(['jquery', '/collections/task.js', 'backbone'], function ($, TaskCollection) {
    return Backbone.View.extend({
        events: {
            'click .w-listitem': function (event) {
                var id = $(event.target).closest('.w-listitem').data('id');
                watchr.router.navigate('g/' + id, {trigger: true});
            },
            'click .w-delete': function (event) {
                event.stopPropagation();
                var id = $(event.target).closest('.w-listitem').data('id');
                watchr.socket.emit('deletetask', id);
            }
        },
        initialize: function () {
            var view = this,
                socket = watchr.socket;
            view.template = Handlebars.templates['task-list/template'];
            view.collection = new TaskCollection();
            view.collection.comparator = function (model) {
                //return -(new Date(model.get('asof')).getTime());
            };
            view.render();
            socket.on('task:update', function (data) {
                console.log('task:update', data);
                view.collection.unshift(data[0]);
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
                watchr.router.navigate('g/' + data[0].task_id, {trigger: true});
                view.collection.unshift(data[0]);
            });
            socket.on('svr:scrape:task', function (data) {
                console.log('svr:scrape:task', data);
                if (data[0].task_id === +Backbone.history.fragment.split('/')[1]) {
                    socket.emit('result', {id: data[0].task_id});
                }
                view.collection.unshift(data[0]);
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
