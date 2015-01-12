"use strict";

function ps(sock, command, workers, next) {
    var s = "> father pid: " + process.pid + "\n", o = {
        father: process.pid,
        child: []
    };
    for (var i in workers) {
        var worker = workers[i].process.pid;
        s += "> child pid: " + worker + "\n", o.child.push(worker);
    }
    return next(sock, s, o);
}

module.exports.body = ps, module.exports.regex = /^ps[\r]?\n/;
