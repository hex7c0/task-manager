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

  var keys = Object.keys(workers);
  var outputString = '> father pid: ' + process.pid + '\n';
  var outputArray = {
    father: process.pid,
    child: []
  };

  for (var i = 0, ii = keys.length; i < ii; ++i) {
    var index = workers[keys[i]];
    var workerPid = index.process.pid;

    outputString += '> child pid: ' + workerPid + '\n';
    outputArray.child.push(workerPid);
  }

  return next(sock, outputString, outputArray);
}

module.exports.body = ps;
module.exports.regex = /^ps[\r]?\n$/i;
