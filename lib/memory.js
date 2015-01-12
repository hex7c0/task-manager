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
 * @exports memory
 * @function memory
 * @param {Object} sock - socket
 * @param {String} command - user command
 * @param {Array} workers - cluster workers
 * @param {Function} next - callback
 */
function memory(sock, command, workers, next) {

  var m = process.memoryUsage();
  return next(sock, '> ' + JSON.stringify(m) + '\n', m);
}

module.exports.body = memory;
module.exports.regex = /^memory[\r]?\n/;
