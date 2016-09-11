"use strict";

function memory(sock, command, workers, next) {
    for (var memory = process.memoryUsage(), keys = Object.keys(memory), output = "", i = 0, ii = keys.length; i < ii; ++i) {
        var index = memory[keys[i]];
        output += "> " + keys[i] + ": " + index + "\n";
    }
    return next(sock, output, memory);
}

module.exports.body = memory, module.exports.regex = /^memory[\r]?\n$/i;
