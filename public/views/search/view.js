'use strict';
define(['jquery', 'socket', 'backbone'], function ($, socket) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['search/template'];
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template());
            view.$el.add = view.$el.find('input[value=Add]');
            view.$el.find('.w-form').submit(function (event) {
                view.$el.add
                    .attr('value', '&nbsp;')
                    .prop('disabled', true)
                    .addClass('w-loading');
                var data = $(this).serializeArray().reduce(function (acc, val) {
                    if (!val.name || !val.value) return acc;
                    return (acc[val.name] = val.value) && acc;
                }, {});
                socket.emit('search', data);
                socket.on('searchResult', function (result) {
                    view.$el.add
                        .attr('value', 'ADD')
                        .prop('disabled', false)
                        .removeClass('w-loading');
                    view.$el.find('input:not([type=submit])').val('');
                });
                event.preventDefault();
            });
        }
    });
});
