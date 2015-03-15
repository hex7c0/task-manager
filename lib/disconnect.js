'use strict';
/**
 * @file task-manager main
 * @module task-manager
 * @subpackage lib
 * @version 1.3.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/**
 * module
 * 
 * @exports disconnect
 * @function disconnect
 * @param {Object} sock - socket
 * @param {String} command - user command
 * @param {Array} workers - cluster workers
 * @param {Function} next - callback
 */
function disconnect(sock, command, workers, next) {

  var i;
  var pid = command.match(/[0-9]+/);

  if (pid && (pid = Number(pid[0]))) { // select
    for (i in workers) {
      var index = workers[i];
      if (index.process.pid === pid) {
        index.disconnect();
        var timeout = setTimeout(function() { // zombie killer

          return index.kill();
        }, 5000);
        index.on('disconnect', function() { // YOLO

          if (index.process.killed === true) {
            clearTimeout(timeout);
          }
          return;
        });
        return next(sock, '> ' + pid + ' disconnected\n', {
          disconnect: pid
        });
      }
    }

    return next(sock, '> child\'s pid not found\n', {
      error: 'pid not found'
    });
  }

  var c = Object.keys(workers); // all
  c.forEach(function(worker) {

    var index = workers[worker];
    index.disconnect();
    var timeout = setTimeout(function() { // zombie killer

      return index.kill();
    }, 5000);
    index.on('disconnect', function() { // YOLO

      if (index.process.killed === true) {
        clearTimeout(timeout);
      }
      return;
    });
    return;
  });

  return next(sock, '> ' + c.length + ' disconnected\n', {
    disconnect: c.length
  });
}

module.exports.body = disconnect;
module.exports.regex = /^disconnect/;
