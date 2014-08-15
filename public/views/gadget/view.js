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
            view.context = {
                title: result.meta.title,
                url: result.meta.url,
                currency: result.meta.currency,
                diff: view.diff(result.set.data),
                latest: Number(result.set.data[0][1]).toLocaleString('en'),
                failed: result.meta.failed,
                data: result.set.data
            };
            view.plot_options = {
                colors: ['#30A0EB'],
                legend: {show: false},
                xaxis: {
                    mode: 'time',
                    tickColor: '#F9F9F9'
                },
                yaxis: {
                    tickColor: '#F9F9F9',
                    tickFormatter: function (v, axis) {
                        return result.meta.currency + Number(v).toLocaleString('en');
                    }
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
            };
            view.formatView = new FormatView({model: view.formatModel.toJSON()});
            view.settingsModel = new Backbone.Model(_.extend({latest_result: latest_result, id: view.id}, result.meta));
            view.settingsView = new SettingsView({model: view.settingsModel});

            view.$el.html(Handlebars.templates['gadget/' + result.format.toLowerCase()](view.context));
            view.$el.find('.w-format').append(view.formatView.el);
            view.$el.find('.JS-settings').append(view.settingsView.el);
            view.$tooltip = view.$el.find('.w-tooltip');
            if (result.format === 'Number') {
                view.render_number(result);
            }
            if (result.format === 'String') {}
        },
        diff: function (array) {
            var first = array[0][1], last = array[array.length - 1][1];
            return last - first;
        },
        destroy: function () {
            var socket = watchr.socket;
            socket.removeAllListeners('task:update');
            socket.removeAllListeners('result');
        },
        render_number: function (result) {
            var view = this;
            $.plot($('.w-flot'), [result.set], view.plot_options);
            view.$el.find('.w-flot').on('plothover', function (event, pos, item) {
                if (item) {
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2),
                        width,
                        height,
                        tooltipOffset = 5,
                        offset = $(this).closest('.W-gadget-list-container').offset();
                    view.$tooltip.html(y);
                    width = view.$tooltip.outerWidth();
                    height = view.$tooltip.outerHeight();
                    view.$tooltip 
                        .css({
                            top: (item.pageY - offset.top) - height - tooltipOffset,
                            left: (item.pageX - offset.left) - width - tooltipOffset
                        })
                        .fadeIn(200);
                } else {
                    $('.w-tooltip').hide();
                } 

            });

        }
    });
});
