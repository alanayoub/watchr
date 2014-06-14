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
            watchr.socket.on('svr:scrape:test', function (data) {
                if (data.error) {
                    // TODO: Glow fade error message
                }
                else {
                    view.$el.find('.w-result').text(data.result);
                    view.$el.find('.W-settings').addClass('w-test-success');
                    view.$el.find('input[name=test]').attr('disabled', 'disabled');
                }
            })
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
                var oldModel = view.$el.savedFormTestModel || JSON.parse(JSON.stringify(view.model)),
                    newModel = $form.serializeArrayFlat();
                // enable test if url or css fields change
                oldModel.url !== newModel.url || oldModel.css !== newModel.css
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
                    view.$el.savedFormTestModel = $form.serializeArrayFlat();
                    socket.emit('cli:scrape:test', $form.serializeArrayFlat());
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
