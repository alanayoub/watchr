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
            var view = this,
                latest_result = result.set.data[0].value || result.set.data[0][1]; // string or array
            view.formatModel = new FormatModel({
                id: view.id,
                selected: result.format || 'String',
                regex: result.meta.regex
            });
            view.formatView = new FormatView({model: view.formatModel.toJSON()});
            view.settingsModel = new Backbone.Model(_.extend({latest_result: latest_result, id: view.id}, result.meta));
            view.settingsView = new SettingsView({model: view.settingsModel});
            view.$el.html(Handlebars.templates['gadget/' + result.format.toLowerCase()](result));
            view.$el.find('.w-format').append(view.formatView.el);
            view.$el.find('.JS-settings').append(view.settingsView.el);
            if (result.format === 'Number') {
                $.plot($('.w-flot'), [result.set], {
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
                        hoverable: true,
                        backgroundColor: null,
                        borderWidth: 2
                    }
                });
                view.$el.find('.w-flot').on('plothover', function (event, pos, item) {
                    if (item) {
                        var x = item.datapoint[0].toFixed(2),
                            y = item.datapoint[1].toFixed(2),
                            offset = $(this).closest('.W-gadget-list-container').offset();
                console.log(JSON.stringify(offset));
                console.log(item.pageY, item.pageX);
                        $('.w-tooltip').html(y)
                            .css({top: (item.pageY - offset.top) + 5, left: (item.pageX - offset.left) + 5})
                            .fadeIn(200);
                    } else {
                        $('.w-tooltip').hide();
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
