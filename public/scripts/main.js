'strict mode'
require([
    'jquery',
    'rest',
    '/views/dashboard/view.js',
    '/views/masthead/view.js',
    '/views/gadget/view.js',
    'errors'
], function ($, rest, DashboardView, MastheadView, GadgetView) {
    var initialized;
    window.watchr = {rest: rest};
    rest.on('logged_out', function () {
        console.log('logged out');
        require(['/views/login/view.js'], function (LoginView) {
            new LoginView({el: '.W-page-container'});
        });
    });
    watchr.router = new (Backbone.Router.extend({
        routes: {
            '': 'home',
            'g/:id': 'home'
        }
    }))();
    watchr.router.on('route:home', function (id) {
        if (!initialized) {
            new MastheadView({el: '.JS-masthead'});
            new DashboardView({el: '.JS-body'});
            initialized = true;
        }
        if (id) new GadgetView({el: '.W-gadget-list', id: id});
    });
    Backbone.history.start({pushState: true});
});