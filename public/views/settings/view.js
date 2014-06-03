'use strict';
define([
    'jquery', 'backbone',
    '/util/jquery/jquery.inlinesvg.js'
], function ($) {
    return Backbone.View.extend({
        events: {
            'click': function (event) {
                event.stopPropagation();
                var $settings = this.$el.find('.W-settings');
                if ($settings.hasClass('w-open')) return;
                $settings.addClass('w-open');
                $(document).on('click.close.settings', function () {
                    $settings.removeClass('w-open');
                    $(document).off('click.close.settings');
                });
            }
        },
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['settings/template'];
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template(view.model));
            view.$el.find('.svg').each(function (idx, val) { // TODO: allow inlinesvg to take array
                $(val).inlinesvg();
            });
        }
    });
});
