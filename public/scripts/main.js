'strict mode'
require([
    'jquery',
    'rest',
    'socket',
    '/views/dashboard/view.js',
    '/views/masthead/view.js',
    '/views/gadget/view.js',
    '/views/gadget-list/view.js',
    'errors'
], function ($, rest, socket, DashboardView, MastheadView, GadgetView, GadgetListView) {
    var initialized, gadgetview;
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
            'g/:id': 'home',
            'p/:id': 'public',
            '*404': '404'
        }
    }))();
    watchr.router.on('route:home', function (id) {
        if (!initialized) {
            new MastheadView({el: '.JS-masthead'});
            new DashboardView({el: '.JS-body'});
            initialized = true;
        }
        if (id) {
            if (gadgetview) gadgetview.destroy();
            gadgetview = new GadgetView({el: '.W-gadget-list', resultId: id});
            watchr.currentgadgetid = +id;
        }
    });
    watchr.router.on('route:404', function () {
        console.log('404');
    });
    watchr.router.on('route:public', function (id) {
        if (id) {
            if (gadgetview) gadgetview.destroy();
            gadgetview = new GadgetView({el: '.JS-body', resultId: id});
        }
        //var publicSocket = io.connect(window.location.origin + '/public');
        //publicSocket.on('test', function (data) {
        //    console.log('test', data);
        //});
        console.log('public');
    });
    socket.on('taskdeleted', function (data) {
        if (data.id !== watchr.currentgadgetid) return;
        new GadgetListView({el: '.JS-gadget-list'});
    });
    Backbone.history.start({pushState: true});
});
