require(['jquery'], function ($) {
    window.watchr = {api: {}};
    watchr.api.request = function (config) {
        $.ajax({
            type: config.meta.method,
            url: config.meta.url,
            data: config.data,
            dataType: 'text',
            statusCode: {
                404: function() {
//                        console.log('404');
                },
                200: function (result) {
//                        console.log('200', result);
                },
                401: function (result) {
                    console.log('unauthorized', result);
                }
            },
            success: function (result, status, jqXHR) {
                console.log('result', result, status, jqXHR);
            }
        })
    };
    watchr.api.search = {
        post: function (config) {
            var meta = {
                method: 'POST',
                url: '/api/search'
            };
            watchr.api.request({data: config.data, meta: meta});
        }
    };
    watchr.api.login = {
        post: function (config) {
            var meta = {
                method: 'POST',
                url: '/api/login'
            };
            watchr.api.request({data: config.data, meta: meta});
        }
    };
    watchr.api.logout = {
        post: function () {
            var meta = {
                method: 'POST',
                url: '/api/logout'
            };
            watchr.api.request({data: '', meta: meta});
        }
    };
    watchr.api.somevalue = {
        get: function (config) {
            var meta = {
                method: 'GET',
                url: '/api/somevalue'
            };
            watchr.api.request({data: '', meta: meta});
        }
    };
});