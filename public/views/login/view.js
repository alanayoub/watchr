'use strict';
define(['jquery', 'backbone'], function ($) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['login/template'];
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template());
            view.$el.find('.w-login').submit(function (event) {
                event.preventDefault();
                var data = $(this).serializeArray().reduce(function (acc, val) {
                    return (acc[val.name] = val.value) && acc;
                }, {});
                watchr.rest.login.post({data: data}).then(function (result) {
                    document.location.reload();
                });
            });
        }
    });
});