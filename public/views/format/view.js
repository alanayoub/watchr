'use strict';
define(['jquery', 'socket', 'backbone'], function ($, socket) {
    return Backbone.View.extend({
        events: {
            'change select': function (event) {
                var view = this;
                socket.emit('update:type', {id: view.getId(), type: $(event.target).val()});
            },
            'submit form': function (event) {
                var view = this;
                event.preventDefault();
                socket.emit('update:regex', {id: view.getId(), regex: event.target.regex.value});
            },
            'keyup input': function () {
                this.setFormState();
            }
        },
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['format/template'];
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template(view.model));
            view.setFormState();
        },
        setFormState: function () {
            var view = this, val,
                $input = view.$el.find('.w-regex'),
                $submit = view.$el.find('[type=submit]');
            val = $input.val();
            if (val === view.model.regex) $submit.attr('disabled', 'disabled');
            else $submit.removeAttr('disabled');
        },
        getId: function () {
            return this.$el.find('[data-id]').data('id');
        }
    });
});
