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

var cluster = require('cluster');

/**
 * module
 * 
 * @exports fork
 * @function fork
 * @param {Object} sock - socket
 * @param {String} command - user command
 * @param {Array} workers - cluster workers
 * @param {Function} next - callback
 */
function fork(sock, command, workers, next) {

  var pid = cluster.fork();

  return next(sock, '> ' + pid.process.pid + ' forked\n', {
    fork: pid.process.pid
  });
}

module.exports.body = fork;
module.exports.regex = /^fork[\r]?\n$/i;
