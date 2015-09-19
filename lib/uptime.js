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
 * @exports uptime
 * @function uptime
 * @param {Object} sock - socket
 * @param {String} command - user command
 * @param {Array} workers - cluster workers
 * @param {Function} next - callback
 */
function uptime(sock, command, workers, next) {

  var u = process.uptime();
  return next(sock, '> uptime: ' + u + ' seconds\n', {
    uptime: u
  });
}

module.exports.body = uptime;
module.exports.regex = /^uptime[\r]?\n$/i;
