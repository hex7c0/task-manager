'use strict';
/**
 * @file udp test
 * @module task-manager
 * @package task-manager
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
var assert = require('assert');
var dgram = require('dgram');
var p = 20004;
function write(string, sock, next) {

  var message = new Buffer(string);
  return sock.server.send(message, 0, message.length, p, '127.0.0.1',
    function(err) {

      return next ? next(err) : null;
    });
}

/*
 * test module
 */
describe('udp', function() {

  var server;

  beforeEach(function(done) {

    server = dgram.createSocket('udp4');
    server.bind(); // random port
    done();
  });

  it('unrecognized', function(done) {

    var c = 0;

    server.on('listening', function() {

      var sock = {
        server: server
      };
      write(1, sock);
    }).on('message', function(buff, sock) {

      sock.server = server;
      var inp = String(buff);
      if (/^> auth required/.test(inp)) {
        write('ciao', sock);
      } else if (/^> hello master/.test(inp)) {
        write('p6s\n', sock);
      } else if (/^> unrecognized/.test(inp)) {
        if (c == 0) {
          write('swa', sock);
        } else if (c == 1) {
          write('exi', sock);
        } else if (c == 2) {
          write('forkk', sock);
        }
        if (c++ >= 3) {
          server.close(done);
        }
      }
    });
  });
  it('ps', function(done) {

    server.on('listening', function() {

      var sock = {
        server: server
      };
      write(1, sock);
    }).on(
      'message',
      function(buff, sock) {

        sock.server = server;
        var inp = String(buff);
        if (/^> father pid: [0-9]+\n> child pid: [0-9]+\n> child pid: [0-9]+\n/
            .test(inp)) {
          server.close(done);
        } else {
          write('ps\n', sock);
        }
      });
  });
  it('fork', function(done) {

    var pid;
    var reg = new RegExp('nope');

    server.on('listening', function() {

      var sock = {
        server: server
      };
      write(1, sock);
    }).on('message', function(buff, sock) {

      sock.server = server;
      var inp = String(buff);
      if (/^> [0-9]+ forked\n/.test(inp)) {
        pid = inp.match(/[0-9]+/);
        if (pid && (pid = pid[0])) {
          write('kill ' + pid + '\n', sock);
          reg = new RegExp('> ' + pid + ' killed\n');
        }
      } else if (reg.test(inp)) {
        server.close(done);
      } else {
        write('fork\n', sock);
      }
    });
  });
  it('exit', function(done) {

    server.on('listening', function() {

      var sock = {
        server: server
      };
      write(1, sock);
    }).on('message', function(buff, sock) {

      sock.server = server;
      var inp = String(buff);
      write('exit\n', sock);
      done(); // don't catch socket close on UDP
    });
  });
});
