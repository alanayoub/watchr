var socket = io.connect('http://localhost:3000');
socket.on('connect', function () {
    console.log('connected');
    socket.emit('chromeGetTasks', {});
    socket.on('chromeTasks', function (data) {
        console.log('updatearino', data);
    });
});

var frame = document.getElementsByTagName('iframe')[0],
    selector = 'h2:first a';
frame.src = "http://alanayoub.com/";

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('background result', $(request.result).find(selector).text());
});
