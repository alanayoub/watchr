'use strict';
define([
    '/views/format/view.js',
    '/models/formatoptions.js',
    '/views/settings/view.js',
    'jquery.flot',
    'jquery.flot.time'
], function (FormatView, FormatModel, SettingsView) {
    return Backbone.View.extend({
        initialize: function (options) {
            var view = this,
                socket = watchr.socket;
            view.id = options.resultId;
            view.formatModel = new FormatModel(view.id);
            view.template = Handlebars.templates['gadget/template'];
            socket.emit('result', {id: view.id});
            socket.on('task:update', function (data) {
                var id = data[0].task_id;
                if (id === view.id) {
                    socket.emit('result', {id: id});
                }
            });
            socket.on('result', function (data) {
                console.log('result', data);
                view.render(data);
            });
        },
        render: function (result) {
            var view = this;
            view.formatModel = new FormatModel({
                id: view.id,
                selected: result.format || 'String',
                regex: result.meta.regex
            });
            view.formatView = new FormatView({model: view.formatModel.toJSON()});
            view.settingsView = new SettingsView({model: {}});
            view.$el.html(Handlebars.templates['gadget/' + result.format.toLowerCase()](result));
            view.$el.find('.w-format').append(view.formatView.el);
            view.$el.find('.JS-settings').append(view.settingsView.el);
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
            var socket = watchr.socket;
            socket.removeAllListeners('task:update');
            socket.removeAllListeners('result');
        }
    });
});
