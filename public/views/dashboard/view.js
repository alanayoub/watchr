'use strict';
define([
    'jquery',
    '/views/search/view.js',
    '/views/task-list/view.js',
    'socket',
    'backbone'
], function ($, SearchView, TaskListView, socket) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['dashboard/template'];
            view.render();
            socket.emit('tasks');
        },
        render: function () {
            var view = this;
            view.$el.html(view.template());
            new SearchView({el: '.JS-search'});
            new TaskListView({el: '.JS-task-list'});
        }
    });
});