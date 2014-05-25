var socket = io.connect('http://localhost:3000'),
    frame = document.getElementsByTagName('iframe')[0],
    tasks, task, source;

socket.on('connect', function () {
    socket.emit('chromeGetTasks', {});
    socket.on('chromeTasks', function (data) {
        console.log('updatearino', data);
        tasks = data;
        scrape();
    });
});

var scrape = function () {
    console.log('scrape');
    source = null;
    task = tasks.filter(function (val) {
        return val.status !== 0 && val.status !== 1;
    })[0];
    if (!task) {
        console.log('emit', tasks);
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
                    console.log('failed both');
                    task.status = 0;
                }
            )
        }
    )
}

var tryIframe = function () {
    console.log('tryIframe');
    var $deferred = $.Deferred();
    frame.src = task.url;
    setTimeout(function () {
        if (source === null) {
            console.log('iframe didnt work');
            $deferred.reject();
        }
        else $deferred.resolve();
    }, 10000);
    return $deferred.promise();
}

var tryAsync = function (data) {
    console.log('tryAsync');
    var $deferred = $.Deferred();
    $.ajax({
        url: task.url,
        type: 'GET'
    }).done(function (result) {
        console.log('Ajax worked');
        debugger;
        source = result;
        $deferred.resolve();
    }).fail(function (error) {
        console.log('Ajax didn\'t work', error);
        debugger;
        source = result;
        $deferred.reject();
    });
    return $deferred.promise();
};

var extractResult = function () {
    debugger;
    console.log('extractResult', $(source).find(task.css).text());
    task.result = $(source).find(task.css).text();
    task.status = 1;
    scrape();
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    source = request.result;
    console.log('iframe did work');
});
