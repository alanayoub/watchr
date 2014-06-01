'use strict';
define([
    'jquery',
    '/views/search/view.js',
    '/views/task-list/view.js',
    '/views/gadget-list/view.js',
    'backbone'
], function ($, SearchView, TaskListView, GadgetListView) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this,
                socket = watchr.socket;
            view.template = Handlebars.templates['dashboard/template'];
            view.render();
            socket.emit('tasks');
            socket.on('update', function (update) {
                console.log('update', update);
            });
        },
        render: function () {
            var view = this;
            view.$el.html(view.template());
            new SearchView({el: '.JS-search'});
            new TaskListView({el: '.JS-task-list'});
            new GadgetListView({el: '.JS-gadget-list'});
        }
    });
});
