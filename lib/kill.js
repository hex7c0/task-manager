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
 * @exports kill
 * @function kill
 * @param {Object} sock - socket
 * @param {String} command - user command
 * @param {Array} workers - cluster workers
 * @param {Function} next - callback
 */
function kill(sock, command, workers, next) {

  var pid = command.match(/[0-9]+/);
  var keys = Object.keys(workers);

  if (pid && (pid = ~~pid[0])) { // select
    for (var i = 0, ii = keys.length; i < ii; ++i) {
      var index = workers[keys[i]];

      if (index.process.pid === pid) {
        index.kill();

        return next(sock, '> ' + pid + ' killed\n', {
          kill: pid
        });
      }
    }

    return next(sock, '> child\'s pid not found\n', {
      error: 'pid not found'
    });
  }

  for (var i = 0, ii = keys.length; i < ii; ++i) {
    var index = workers[keys[i]];
    index.kill();
  }

  return next(sock, '> ' + ii + ' killed\n', {
    kill: ii
  });
}

module.exports.body = kill;
module.exports.regex = /^kill/i;
