'use strict';
/**
 * @file command server
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
var task = require('../../'); // use require('task-manager')
var cluster = require('cluster');
var http = require('http');
var p = 20001;

/*
 * use
 */
if (cluster.isMaster) {
  // 2 children
  cluster.fork();
  cluster.fork();
  cluster.on('exit', function(worker, code, signal) {

    return cluster.fork();
  });

  task(p, {
    output: false,
    json: true
  });
}

if (cluster.isWorker) {
  process.on('disconnect', function() {

    return process.exit();
  });

  http.createServer(function(req, res) {

    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello World\n');
  }).listen(p - 10000, '127.0.0.1');
}

setTimeout(function() { // autokiller

  return process.exit(1);
}, p);
