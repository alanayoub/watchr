define(['rest', 'backbone'], function (rest) {
    $(document).ajaxError(function (event, xhr, settings, error) {
        if (xhr.status == 401) {
            var message = {status: xhr.status, message: error};
            console.log('ajaxError global: ', xhr.status, message);
            rest.trigger('logged_out', message);
        }
    });
});