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
 * @exports title
 * @function title
 * @param {Object} sock - socket
 * @param {String} command - user command
 * @param {Array} workers - cluster workers
 * @param {Function} next - callback
 */
function title(sock, command, workers, next) {

  var command = command.replace(/^title[ ]?/i, '');
  var name = command.match(/^[a-z0-9]+/i);

  if (name && (name = String(name[0]))) { // set
    process.title = name;
  }
  name = process.title; // get

  return next(sock, '> title: ' + name + '\n', {
    name: name
  });
}

module.exports.body = title;
module.exports.regex = /^title/i;
