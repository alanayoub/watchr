'use strict';
define(['socket'], function () {
    var socket = io.connect(window.location.origin);
    return socket;
});
