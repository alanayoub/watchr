'use strict';
define(['socket'], function () {
    var socket = io.connect('http://54.85.189.132:3000/');
    return socket;
});
