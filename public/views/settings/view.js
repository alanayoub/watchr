'use strict';
define([
    'jquery', 'backbone',
    '/util/jquery/jquery.inlinesvg.js'
], function ($) {
    return Backbone.View.extend({
        events: {
        },
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['settings/template'];
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template(view.model));
            view.$el.find('.svg').inlinesvg();
        }
    });
});
