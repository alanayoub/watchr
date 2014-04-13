'use strict';
define(['jquery', 'socket', 'flot', 'flottime', 'backbone'], function ($, socket) {
    var view;
    return Backbone.View.extend({
        initialize: function (options) {
            view = this;
            view.id = options.resultId;
            view.template = Handlebars.templates['gadget/template'];
            socket.emit('result', {id: view.id});
            socket.on('task:update', function (data) {
                console.log('socket: task:update', data);
                var id = data[0].task_id;
                if (id === view.id) {
                    socket.emit('result', {id: id});
                }
            });
            socket.on('result', function (data) {
                console.log('socket: result', data);
                view.render(data);
            });
        },
        render: function (result) {
            var view = this;
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
        },
        destroy: function () {
            socket.removeAllListeners('task:update');
            socket.removeAllListeners('result');
        }
    });
});
