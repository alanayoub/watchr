define(['backbone'], function () {
    return Backbone.Model.extend({
        urlRoot: '/api/user/'
    });
});