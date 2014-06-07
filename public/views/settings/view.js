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
            var view = this, socket = watchr.socket;
            view.$el.html(view.template(view.model.toJSON()));
            view.$el.$save = view.$el.find('input[value=Save]');
            view.$el.$form = view.$el.find('form'); 
            view.$el.find('.svg').each(function (idx, val) { // TODO: allow inlinesvg to take array
                $(val).inlinesvg();
            });
            view.$el.on('change keyup', 'input, select, textarea', function () {
                var $submit = view.$el.$save;
                if (view.$el.$form.serialize() !== view.$el.savedFormString) $submit.removeAttr('disabled');
                else $submit.attr('disabled', 'disabled');
            });
            view.$el.savedFormString = view.$el.find('form').serialize();
            view.$el.find('form').off('submit.form').on('submit.form', function (event) {
                event.preventDefault();
                var $form = view.$el.$form;
                view.$el.$save.attr('disabled', 'disabled');
                socket.emit('cli:settings:save', view.model.toJSON());
            });
        }
    });
});
