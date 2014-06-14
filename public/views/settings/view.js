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
            var view = this,
                socket = watchr.socket,
                $save, $test, $form;
            view.$el.html(view.template(view.model.toJSON()));
            view.$el.find('.svg').each(function (idx, val) { // TODO: allow inlinesvg to take array
                $(val).inlinesvg();
            });
            $save = view.$el.find('input[name=save]');
            $test = view.$el.find('input[name=test]');
            $form = view.$el.find('form');
            view.$el.on('change keyup', 'input, select, textarea', function () {
                var oldModel = view.model,
                    newModel = $form.serializeArrayFlat();
                // enable test if url or css fields change
                oldModel.get('url') !== newModel.url || oldModel.get('css') !== newModel.css
                    ? $test.removeAttr('disabled')
                    : $test.attr('disabled', 'disabled');
                // enable submit if any field changes
                $form.serialize() !== view.$el.savedFormString
                    ? $save.removeAttr('disabled')
                    : $save.attr('disabled', 'disabled')
            });
            view.$el.savedFormString = view.$el.find('form').serialize();
            view.$el.find('form [type=submit]').off('click.form').on('click.form', function (event) {
                event.preventDefault();
                if ($(this).attr('name') === 'test') {
                }
                else {
                    $save.attr('disabled', 'disabled');
                    view.model.set($form.serializeArrayFlat());
                    socket.emit('cli:settings:save', view.model.toJSON());
                }
            });
        }
    });
});
