'use strict';
define(['jquery', 'socket', 'backbone'], function ($, socket) {
    var view;
    return Backbone.View.extend({
        events: {
            'change select': function (event) {
                socket.emit('format', {newvalue: $(event.target).val()});
            }
        },
        initialize: function () {
            view = this;
            view.template = Handlebars.templates['togglebutton/template'];
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template(view.model));
        }
    });
});
