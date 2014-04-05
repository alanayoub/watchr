'use strict';
define(['jquery', 'socket', 'flot', 'flottime', 'backbone'], function ($, socket) {
    var view;
    socket.on('result', function (data) {
        if (view) view.render(data);
    });
    return Backbone.View.extend({
        initialize: function (options) {
            view = this;
            view.id = options.resultId;
            view.template = Handlebars.templates['gadget/template'];
            console.log('setting up emit for', options.resultId);
            socket.emit('result', {id: view.id});
//            socket.on('task:update', function (data) {
//                var id = data[0].task_id;
//                if (id === view.id) socket.emit('result', {id: id});
//            });
        },
        render: function (result) {
            var view = this;
            console.log('result', result);
            view.$el.html(Handlebars.templates['gadget/' + result.format.toLowerCase()](result));
            if (result.format === 'Number') {
                $.plot($(".w-flot"), [result.set], {
//                yaxis: { min: 0 },
                    colors: ['#30A0EB'],
                    legend: {
                        show: false
                    },
                    xaxis: {
                        mode: 'time',
                        tickColor: '#F9F9F9'
                    },
                    yaxis: {
                        tickColor: '#F9F9F9'
                    },
                    series: {
                        points: {
                            show: true,
                            radius: 3,
                            lineWidth: 1
                        },
                        lines: {
                            lineWidth: 1,
                            show: true
                        },
                        shadowSize: null
                    },
                    grid: {
                        show: true,
                        color: '#F9F9F9',
                        backgroundColor: null,
                        borderWidth: 2
                    }
                });
            }
            if (result.format === 'String') {

            }
        }
    });
});
