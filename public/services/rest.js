define(['backbone'], function () {
    var rest = {};
    _.extend(rest, Backbone.Events);
    rest.request = function (config) {
        var $deferred = $.Deferred();
        $.ajax({
            type: config.meta.method,
            url: config.meta.url,
            data: config.data || null,
            dataType: 'text',
            statusCode: {
                404: function() {},
                200: function () {},
                401: function () {}
            },
            success: function (result, status, jqXHR) {
                $deferred.resolve(result);
            },
            error: function (xhr, status, message) {
                console.warn('Ajax error:', {status: xhr.status, message: message});
                $deferred.reject({status: xhr.status, message: message});
            }
        });
        return $deferred.promise();
    };
    rest.search = {
        post: function (config) {
            var meta = {
                method: 'POST',
                url: '/api/search'
            };
            return rest.request({data: config.data, meta: meta});
        }
    };
    rest.login = {
        post: function (config) {
            var meta = {
                method: 'POST',
                url: '/api/login'
            };
            return rest.request({data: config.data, meta: meta});
        }
    };
    rest.logout = {
        post: function () {
            var meta = {
                method: 'POST',
                url: '/api/logout'
            };
            return rest.request({meta: meta});
        }
    };
    rest.user = {
        get: function (config) {
            var meta = {
                method: 'GET',
                url: '/api/user'
            };
            return rest.request({meta: meta});
        }
    };
    rest.task = {
        get: function (config) {
            var meta = {
                method: 'GET',
                url: '/api/task'
            };
            return rest.request({meta: meta});
        }
    };
    return rest;
});