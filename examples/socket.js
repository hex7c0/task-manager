'use strict';
/**
 * @file socket example
 * @module task-manager
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
var task = require('..'); // use require('task-manager') instead
var cluster = require('cluster');
var http = require('http');

/*
 * use
 */
if (cluster.isMaster) {
  // 2 children
  cluster.fork();
  cluster.fork();
  cluster.on('exit', function(worker, code, signal) {

    console.error(worker.process.pid + ' died');
    return;
  });

  task('unix.sock'); // open unix sock
}

if (cluster.isWorker) {
  http.createServer(function(req, res) {

    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello World\n');
  }).listen(3000, '127.0.0.1');
  console.log('Server running at http://127.0.0.1:3000/');
}
