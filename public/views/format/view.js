'use strict';
define(['jquery', 'socket', 'backbone'], function ($, socket) {
    return Backbone.View.extend({
        events: {
            'change select': function (event) {
                var id = $(event.target).closest('[data-id]').data('id');
                socket.emit('format', {id: id, format: $(event.target).val()});
            },
            'submit form': function (event) {
                event.preventDefault();
                console.log('event', event.target);
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
            if (!val || val === view.model.regex) $submit.attr('disabled', 'disabled');
            else $submit.removeAttr('disabled');
        }
    });
});
