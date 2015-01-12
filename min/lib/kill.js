"use strict";

function kill(sock, command, workers, next) {
    var i, pid = command.match(/[0-9]+/);
    if (pid && (pid = Number(pid[0]))) {
        for (i in workers) {
            var index = workers[i];
            if (index.process.pid === pid) return index.kill(), next(sock, "> " + pid + " killed\n", {
                kill: pid
            });
        }
        return next(sock, "> child's pid not found\n", {
            error: "pid not found"
        });
    }
    var c = Object.keys(workers).length;
    for (i in workers) workers[i].kill();
    return next(sock, "> " + c + " killed\n", {
        kill: c
    });
}

module.exports.body = kill, module.exports.regex = /^kill/;
