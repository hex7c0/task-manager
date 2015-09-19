"use strict";

function kill(sock, command, workers, next) {
    var pid = command.match(/[0-9]+/), keys = Object.keys(workers);
    if (pid && (pid = ~~pid[0])) {
        for (var i = 0, ii = keys.length; ii > i; ++i) {
            var index = workers[keys[i]];
            if (index.process.pid === pid) return index.kill(), next(sock, "> " + pid + " killed\n", {
                kill: pid
            });
        }
        return next(sock, "> child's pid not found\n", {
            error: "pid not found"
        });
    }
    for (var i = 0, ii = keys.length; ii > i; ++i) {
        var index = workers[keys[i]];
        index.kill();
    }
    return next(sock, "> " + ii + " killed\n", {
        kill: ii
    });
}

module.exports.body = kill, module.exports.regex = /^kill/i;
