'use strict';
define(['jquery', 'backbone'], function ($) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['gadget/template'];
            console.log('view', view);
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template({id: view.id}));
        }
    });
});
