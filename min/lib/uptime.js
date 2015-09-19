"use strict";

function uptime(sock, command, workers, next) {
    var u = process.uptime();
    return next(sock, "> uptime: " + u + " seconds\n", {
        uptime: u
    });
}

module.exports.body = uptime, module.exports.regex = /^uptime[\r]?\n$/i;
