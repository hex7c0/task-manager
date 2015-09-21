'use strict';
/**
 * @file tls example
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
var fs = require('fs');

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

  task(6000, {
    tls: {
      key: fs.readFileSync('test_key.pem'),
      cert: fs.readFileSync('test_cert.pem')
    }
  }); // open TLS on port 6000
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
