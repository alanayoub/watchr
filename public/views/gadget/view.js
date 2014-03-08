'use strict';
define(['jquery', 'socket', 'flot', 'flottime', 'backbone'], function ($, socket) {
    var view;
    socket.on('result', function (data) {
        if (view) view.render(data);
    });
    return Backbone.View.extend({
        initialize: function (options) {
            view = this;
            view.template = Handlebars.templates['gadget/template'];
            console.log('setting up emit');
            socket.emit('result', {id: options.resultId});
        },
        render: function (result) {
            var view = this;
            console.log('result', result);
            view.$el.html(Handlebars.templates['gadget/' + result.format.toLowerCase()](result));
            if (result.format === 'Number') {
                $.plot($("#placeholder"), [result.set], {
//                yaxis: { min: 0 },
                    xaxis: {mode: 'time'}
                });
            }
            if (result.format === 'String') {

            }
        }
    });
});
