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
 * @exports memory
 * @function memory
 * @param {Object} sock - socket
 * @param {String} command - user command
 * @param {Array} workers - cluster workers
 * @param {Function} next - callback
 */
function memory(sock, command, workers, next) {

  var memory = process.memoryUsage();
  var keys = Object.keys(memory);

  var output = '';
  for (var i = 0, ii = keys.length; i < ii; ++i) {
    var index = memory[keys[i]];
    output += '> ' + keys[i] + ': ' + index + '\n';
  }

  return next(sock, output, memory);
}

module.exports.body = memory;
module.exports.regex = /^memory[\r]?\n$/i;
