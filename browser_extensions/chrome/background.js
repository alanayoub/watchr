var frame = document.getElementsByTagName('iframe')[0],
    selector = 'h2:first a';
frame.src = "http://alanayoub.com/";

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('background result', $(request.result).find(selector).text());
});
