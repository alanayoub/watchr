'use strict';
define(['socket'], function () {
    var socket = io.connect('http://localhost:3000/');
    return socket;
});