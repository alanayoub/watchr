if (location.ancestorOrigins[0] === 'chrome-extension://' + chrome.runtime.id) {
    chrome.extension.sendMessage({
        loaded: window.location.href,
        result: window.document.body.innerHTML
    });
}
