'use strict';
/**
 * @file task-manager main
 * @module task-manager
 * @package task-manager
 * @subpackage lib
 * @version 1.2.0
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

  var i;
  var pid = command.match(/[0-9]+/);

  if (pid && (pid = Number(pid[0]))) { // select
    for (i in workers) {
      var index = workers[i];
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

  var c = Object.keys(workers).length; // all
  for (i in workers) {
    workers[i].kill();
  }
  return next(sock, '> ' + c + ' killed\n', {
    kill: c
  });
}

module.exports.body = kill;
module.exports.regex = /^kill/;
