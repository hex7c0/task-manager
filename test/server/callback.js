'use strict';
/**
 * @file callback server
 * @module task-manager
 * @package task-manager
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
  var task = require('../../'); // use require('task-manager')
  var cluster = require('cluster');
  var http = require('http');
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}
// load
var p = 20000;

/*
 * use
 */
if (cluster.isMaster) {
  // 2 children
  cluster.fork();
  cluster.fork();
  cluster.on('exit', function(worker, code, signal) {

    return;
  });

  task(p, {
    output: false,
    auth: 'ciao',
    custom: /^parrot/,
    callback: function(sock, command) {

      sock.write(command);
      return;
    }
  });
}

if (cluster.isWorker) {
  http.createServer(function(req, res) {

    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello World\n');
  }).listen(3000, '127.0.0.1');
}
