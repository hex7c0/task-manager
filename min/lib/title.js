"use strict";

function title(sock, command, workers, next) {
    var name = (command = command.replace(/^title[ ]?/i, "")).match(/^[a-z0-9]+/i);
    return name && (name = String(name[0])) && (process.title = name), next(sock, "> title: " + (name = process.title) + "\n", {
        name: name
    });
}

module.exports.body = title, module.exports.regex = /^title/i;
