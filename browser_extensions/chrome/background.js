var socket = io.connect('http://localhost:3000'),
    frame = document.getElementsByTagName('iframe')[0],
    tasks, task, source;

socket.on('connect', function () {
    socket.emit('chromeGetTasks', {});
    socket.on('chromeTasks', function (data) {
        console.log('updatearino', data);
        source = null;
        task = data[0];
        task.css = '.s9TitleText:first';
        task.url = 'http://www.amazon.co.uk';
        tryIframe()
            .done(extractResult)
            .fail(tryAsync()
                .done(extractResult)
                .fail(function () {
                    console.log('failed both');
                })
            );
    });
});

var tryIframe = function () {
    var $deferred = $.Deferred();
    frame.src = task.url;
    setTimeout(function () {
        if (source === null) {
            console.log('iframe didnt work');
            $deferred.reject();
        }
        else $deferred.resolve();
    }, 2000);
    return $deferred.promise();
}

var tryAsync = function (data) {
    var $deferred = $.Deferred();
    $.ajax({
        url: task.url,
        type: 'GET'
    }).done(function (result) {
        console.log('Ajax worked');
        source = result;
        $deferred.resolve();
    }).fail(function (error) {
        console.log('Ajax didn\'t work', error);
        source = result;
        $deferred.reject();
    });
    return $deferred.promise();
};

var extractResult = function () {
    console.log('result', $(source).find(task.css).text());
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    source = request.result;
    console.log('iframe did work');
});
