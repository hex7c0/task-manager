"use strict";

function title(sock, command, workers, next) {
    var command = command.replace(/^title[ ]?/, ""), name = command.match(/^[A-Za-z0-9]+/);
    return name && (name = String(name[0])) && (process.title = name), name = process.title, 
    next(sock, "> title: " + name + "\n", {
        name: name
    });
}

module.exports.body = title, module.exports.regex = /^title/;
