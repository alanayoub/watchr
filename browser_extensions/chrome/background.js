var socket = io.connect('http://localhost:3000'),
    frame = document.getElementsByTagName('iframe')[0],
    tasks, task, source, interval;

socket.on('connect', function () {
    socket.emit('chromeTasksRequest', {});
    console.log('emitting chromeTasksRequest');
    socket.on('chromeTasks', function (data) {
        console.log('receiving chromeTasks');
        tasks = data;
        interval = data.interval || 30000;
        if (!data.length) {
            setTimeout(function () {
                socket.emit('chromeTasksRequest', {});
                console.log('emitting chromeTasksRequest');
            }, interval);
        }
        else scrape();
    });
});

var scrape = function () {
    source = null;
    task = tasks.filter(function (val) {
        return val.status !== 0 && val.status !== 1;
    })[0];
    if (!task) {
        socket.emit('chromeTaskResults', tasks);
        setTimeout(function () {
            socket.emit('chromeTasksRequest', {});
        }, interval);
        console.log('emitting chromeTasksResults');
        console.log('emitting chromeTasksRequest');
        return;
    };
    tryIframe().then(
        function (response) {
            extractResult();
        },
        function (error) {
            tryAsync().then(
                function (response) {
                    extractResult();
                },
                function (error) {
                    task.status = 0;
                    scrape();
                }
            )
        }
    )
}

var tryIframe = function () {
    var $deferred = $.Deferred();
    frame.src = task.url;
    setTimeout(function () {
        if (source === null) {
            task.XFrameOptions = true;
            $deferred.reject();
        }
        else $deferred.resolve();
    }, 10000);
    return $deferred.promise();
}

var tryAsync = function (data) {
    var $deferred = $.Deferred();
    $.ajax({
        url: task.url,
        type: 'GET'
    }).done(function (result) {
        source = result;
        $deferred.resolve();
    }).fail(function (error) {
        source = result;
        $deferred.reject();
    });
    return $deferred.promise();
};

var extractResult = function () {
    task.value = $(source).find(task.css).text();
    task.status = 1;
    console.log('extractResult', $(source).find(task.css).text());
    scrape();
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    source = request.result;
});
