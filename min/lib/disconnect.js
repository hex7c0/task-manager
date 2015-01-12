"use strict";

function disconnect(sock, command, workers, next) {
    var i, pid = command.match(/[0-9]+/);
    if (pid && (pid = Number(pid[0]))) {
        for (i in workers) {
            var index = workers[i];
            if (index.process.pid === pid) {
                index.disconnect();
                var timeout = setTimeout(function() {
                    return index.kill();
                }, 5e3);
                return index.on("disconnect", function() {
                    index.process.killed === !0 && clearTimeout(timeout);
                }), next(sock, "> " + pid + " disconnected\n", {
                    disconnect: pid
                });
            }
        }
        return next(sock, "> child's pid not found\n", {
            error: "pid not found"
        });
    }
    var c = Object.keys(workers);
    return c.forEach(function(worker) {
        var index = workers[worker];
        index.disconnect();
        var timeout = setTimeout(function() {
            return index.kill();
        }, 5e3);
        index.on("disconnect", function() {
            index.process.killed === !0 && clearTimeout(timeout);
        });
    }), next(sock, "> " + c.length + " disconnected\n", {
        disconnect: c.length
    });
}

module.exports.body = disconnect, module.exports.regex = /^disconnect/;
