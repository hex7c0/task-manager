"use strict";

function memory(sock, command, workers, next) {
    var m = process.memoryUsage(), index = "";
    for (var i in m) index += "> " + i + ": " + m[i] + "\n";
    return next(sock, index, m);
}

module.exports.body = memory, module.exports.regex = /^memory[\r]?\n/;
