'strict mode'
require([
    'jquery',
    'rest',
    '/views/dashboard/view.js',
    '/views/masthead/view.js',
    'errors'
], function ($, rest, DashboardView, MastheadView) {
    window.watchr = {rest: rest};
    rest.on('logged_out', function () {
        console.log('logged out');
        require(['/views/login/view.js'], function (LoginView) {
            new LoginView({el: '.W-page-container'});
        });
    });
    watchr.router = new (Backbone.Router.extend({
        routes: {
            '': 'home'
        }
    }))();
    watchr.router.on('route:home', function () {
        new MastheadView({el: '.JS-masthead'});
        new DashboardView({el: '.JS-body'});
    });
    Backbone.history.start({pushStage: true});
});