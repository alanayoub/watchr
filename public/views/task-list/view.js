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
                console.log('task:update', data);
                var id = data[0] && data[0].task_id;
                if (id) view.$el.find('[data-id=' + id + ']').addClass('w-updated');
                view.collection.set(data[0], {remove: false});
                console.log('task:update after - collection -', view.collection);
            });
            socket.on('tasks', function (data) {
                console.log('tasks', data);
                //var model = view.collection.get(data[0].task_id);
                view.collection.set(data.result);
                console.log('task after - collection - ', view.collection);
                //view.render();
            });
            view.collection.on('change add', function () {
                console.log('CHANGE ADD');
                view.render();
            });
        },
        render: function (data) {
            console.log('RENDER');
            var view = this;
            view.$el.html(view.template({tasks: view.collection.toJSON()}));
        }
    });
});
