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

  var pid = command.match(/[0-9]+/);
  var keys = Object.keys(workers);

  if (pid && (pid = ~~pid[0])) { // select
    for (var i = 0, ii = keys.length; i < ii; ++i) {
      var index = workers[keys[i]];

      if (index.process.pid === pid) {
        index.disconnect();
        index._timeout = setTimeout(function() { // zombie killer

          return index.kill();
        }, 5000);

        index.on('disconnect', function() { // YOLO

          if (index.process.killed === true) {
            clearTimeout(index._timeout);
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

  for (var i = 0, ii = keys.length; i < ii; ++i) {
    var index = workers[keys[i]];
    index.disconnect();
    index._timeout = setTimeout(function() { // zombie killer

      return index.kill();
    }, 5000);

    index.on('disconnect', function() { // YOLO

      if (index.process.killed === true) {
        clearTimeout(index._timeout);
      }
      return;
    });
  }

  return next(sock, '> ' + ii + ' disconnected\n', {
    disconnect: ii
  });
}

module.exports.body = disconnect;
module.exports.regex = /^disconnect/i;
