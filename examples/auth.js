'use strict';
/**
 * @file auth example
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
var http = require('http');

/*
 * use
 */
task('unix.sock', {
  auth: 'pippo', // send command only if pass auth request
});

http.createServer(function(req, res) {

  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Hello World\n');
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
