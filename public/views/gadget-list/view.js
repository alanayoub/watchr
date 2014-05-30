'use strict';
define(['jquery', 'backbone'], function ($) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['gadget-list/template'];
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template({}));
        }
    });
});
