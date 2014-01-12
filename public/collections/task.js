define(['/models/task.js', 'backbone'], function (TaskModel) {
    return Backbone.Collection.extend({
        url: '/api/task/',
        model: TaskModel
    });
});