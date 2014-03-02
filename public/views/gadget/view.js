'use strict';
define(['jquery', 'socket', 'flot', 'flottime', 'backbone'], function ($, socket) {
    return Backbone.View.extend({
        initialize: function (options) {
            var view = this;
            view.template = Handlebars.templates['gadget/template'];
            console.log('setting up emit');
            socket.emit('result', {id: options.resultId});
            socket.on('result', function (data) {
                view.render(data);
            });
        },
        render: function (result) {
            var view = this;
            console.log('result', result);
            view.$el.html(view.template(result));
            $.plot($("#placeholder"), [result.set], {
//                yaxis: { min: 0 },
                xaxis: {mode: 'time'}
            });
        }
    });
});
