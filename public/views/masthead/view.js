'use strict';
define(['jquery', '/models/user.js', 'backbone'], function ($, UserModel) {
    return Backbone.View.extend({
        initialize: function () {
            var view = this;
            view.template = Handlebars.templates['masthead/template'];
            view.model = new UserModel();
            view.model.fetch();
            view.render();
        },
        render: function () {
            var view = this;
            view.$el.html(view.template({username: 'alanayoub'}));
            view.$el.find('.w-signout').off('click.signout').on('click.signout', function () {
                watchr.rest.logout.post().then(function (result) {
                    console.log('logout result: ', result);
                    console.log('logout: need to trigger signout here!');
                    document.location.reload();
                });
            });

        }
    });
});