"use strict";

var cluster = require("cluster");

function fork(sock, command, workers, next) {
    var pid = cluster.fork();
    return next(sock, "> " + pid.process.pid + " forked\n", {
        fork: pid.process.pid
    });
}

module.exports.body = fork, module.exports.regex = /^fork[\r]?\n$/i;
