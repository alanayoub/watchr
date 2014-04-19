'use strict';
define(['jquery', 'socket', 'backbone'], function ($, socket) {
    var view;
    return Backbone.View.extend({
        events: {
            'change select': function (event) {
                var id = $(event.target).closest('[data-id]').data('id');
                socket.emit('format', {id: id, format: $(event.target).val()});
            }
        },
        initialize: function () {
            view = this;
            view.template = Handlebars.templates['format/template'];
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template(view.model));
        }
    });
});
