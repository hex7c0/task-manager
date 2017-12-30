"use strict";

function ps(sock, command, workers, next) {
    for (var keys = Object.keys(workers), outputString = "> father pid: " + process.pid + "\n", outputArray = {
        father: process.pid,
        child: []
    }, i = 0, ii = keys.length; i < ii; ++i) {
        var workerPid = workers[keys[i]].process.pid;
        outputString += "> child pid: " + workerPid + "\n", outputArray.child.push(workerPid);
    }
    return next(sock, outputString, outputArray);
}

module.exports.body = ps, module.exports.regex = /^ps[\r]?\n$/i;
