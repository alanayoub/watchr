'use strict';
define(['jquery', 'backbone'], function ($) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['search/template'];
            view.render();
        },
        render: function () {
            var view = this, 
                socket = watchr.socket;
            view.$el.html(view.template());
            view.$el.add = view.$el.find('input[value=Add]');
            view.$el.find('.w-form').submit(function (event) {
                view.$el.add
                    .attr('value', ' ')
                    .prop('disabled', true)
                    .addClass('w-loading');
                var data = $(this).serializeArrayFlat();
                socket.emit('search', data);
                socket.on('searchResult', function (result) {
                    view.$el.add
                        .attr('value', 'ADD')
                        .prop('disabled', false)
                        .removeClass('w-loading');
                    if (result.success) view.$el.find('input:not([type=submit])').val('');
                });
                event.preventDefault();
            });
        }
    });
});
