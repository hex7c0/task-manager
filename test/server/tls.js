'use strict';
/**
 * @file tls server
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
var fs = require('fs');
var path = require('path');
var p = 20004;

/*
 * use
 */
if (cluster.isMaster) {
  // 2 children
  cluster.fork();
  cluster.fork();

  task(p, {
    output: false,
    auth: 'ciao',
    tls: {
      key: fs.readFileSync(path.join(__dirname, '../../examples',
        'test_key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '../../examples',
        'test_cert.pem')),
    }
  });
}

if (cluster.isWorker) {
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
