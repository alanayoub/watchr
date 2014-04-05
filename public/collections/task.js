define(['/models/task.js', 'backbone'], function (TaskModel) {
    return Backbone.Collection.extend({
        model: TaskModel,
        idAttribute: 'task_id'
    });
});
