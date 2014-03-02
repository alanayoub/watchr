'use strict';
define(['jquery', 'socket', 'backbone'], function ($, socket) {
    return Backbone.View.extend({
        initialize: function (options) {
            var view = this;
            view.template = Handlebars.templates['gadget/template'];
            socket.emit('result', {id: options.resultId});
            socket.on('result', function (data) {
                view.render(data);
            });
        },
        render: function (result) {
            var view = this;
            console.log('result', result);
            view.$el.html(view.template(result));
        }
    });
});
