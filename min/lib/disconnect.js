"use strict";

function disconnect(sock, command, workers, next) {
    var pid = command.match(/[0-9]+/), keys = Object.keys(workers);
    if (pid && (pid = ~~pid[0])) {
        for (var i = 0, ii = keys.length; i < ii; ++i) {
            var index = workers[keys[i]];
            if (index.process.pid === pid) return index.disconnect(), index._timeout = setTimeout(function() {
                return index.kill();
            }, 5e3), index.on("disconnect", function() {
                index.process.killed === !0 && clearTimeout(index._timeout);
            }), next(sock, "> " + pid + " disconnected\n", {
                disconnect: pid
            });
        }
        return next(sock, "> child's pid not found\n", {
            error: "pid not found"
        });
    }
    for (var i = 0, ii = keys.length; i < ii; ++i) {
        var index = workers[keys[i]];
        index.disconnect(), index._timeout = setTimeout(function() {
            return index.kill();
        }, 5e3), index.on("disconnect", function() {
            index.process.killed === !0 && clearTimeout(index._timeout);
        });
    }
    return next(sock, "> " + ii + " disconnected\n", {
        disconnect: ii
    });
}

module.exports.body = disconnect, module.exports.regex = /^disconnect/i;
