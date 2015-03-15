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
 * @exports ps
 * @function ps
 * @param {Object} sock - socket
 * @param {String} command - user command
 * @param {Array} workers - cluster workers
 * @param {Function} next - callback
 */
function ps(sock, command, workers, next) {

  var s = '> father pid: ' + process.pid + '\n';
  var o = {
    father: process.pid,
    child: []
  };

  for ( var i in workers) {
    var worker = workers[i].process.pid;
    s += '> child pid: ' + worker + '\n';
    o.child.push(worker);
  }

  return next(sock, s, o);
}

module.exports.body = ps;
module.exports.regex = /^ps[\r]?\n/;
