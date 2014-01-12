'use strict';
define([
    'jquery',
    '/collections/task.js',
    'backbone'
], function ($, TaskCollection) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['task-list/template'];
            view.collection = new TaskCollection();
            view.listenTo(view.collection, 'sync', view.render);
            view.collection.fetch();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template({tasks: view.collection.toJSON()[0].result}));
        }
    });
});