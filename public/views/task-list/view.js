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
            view.template = Handlebars.templates['task-list/template'];
            socket.on('task:update', function (data) {
                console.log('update', data);
                var id = data[0] && data[0].task_id;
                if (id) view.$el.find('[data-id=' + id + ']').addClass('w-updated');
                view.collection.add(data);
                console.log('task collection after update', view.collection);
            });
            socket.on('tasks', function (data) {
                console.log('recieved tasks', data);
                view.collection.add(data.result);
                console.log('task collection', view.collection);
                view.render(data);
            });
            view.collection.on('change add', function () {
                console.log('view collection changed');
            });
        },
        render: function (data) {
            var view = this;
            view.$el.html(view.template({tasks: data.result}));
        }
    });
});
