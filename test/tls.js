'use strict';
/**
 * @file tcp test
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
var task = require('..'); // use require('task-manager')
var assert = require('assert');
var tls = require('tls');
var p = 20004;

/*
 * test module
 */
describe(
  'tls',
  function() {

    it('auth', function(done) {

      var c = 0;
      var nc = tls.connect(p, '127.0.0.1', {
        rejectUnauthorized: false, // certificate has expired
      }, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> auth required/.test(inp)) {
            if (c == 0) {
              nc.write('swa');
            } else if (c == 1) {
              nc.write('exi');
            } else if (c == 2) {
              nc.write('forkk');
            }
            if (c++ >= 3) {
              nc.write('ciao\n');
            }
          } else if (/^> hello master/.test(inp)) {
            nc.end(done);
          }
        });
      });
    });
    it('unrecognized', function(done) {

      var c = 0;
      var nc = tls.connect(p, '127.0.0.1', {
        rejectUnauthorized: false, // certificate has expired
      }, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> auth required/.test(inp)) {
            nc.write('ciao');
          } else if (/^> hello master/.test(inp)) {
            nc.write('p6s\n');
          } else if (/^> unrecognized/.test(inp)) {
            if (c == 0) {
              nc.write('swa');
            } else if (c == 1) {
              nc.write('exi');
            } else if (c == 2) {
              nc.write('forkk');
            }
            if (c++ >= 3) {
              nc.end(done);
            }
          }
        });
      });
    });
    it(
      'ps',
      function(done) {

        var nc = tls
            .connect(
              p,
              '127.0.0.1',
              {
                rejectUnauthorized: false, // certificate has expired
              },
              function() {

                nc.setNoDelay(true);
                nc
                    .on(
                      'data',
                      function(buff) {

                        var inp = String(buff);
                        if (/^> auth required/.test(inp)) {
                          nc.write('ciao');
                        } else if (/^> hello master/.test(inp)) {
                          nc.write('ps\n');
                        } else if (/^> father pid: [0-9]+\n> child pid: [0-9]+\n> child pid: [0-9]+\n/
                            .test(inp)) {
                          nc.end(done);
                        }
                      });
              });
      });
    it('fork', function(done) {

      var pid;
      var reg = new RegExp('nope');
      var nc = tls.connect(p, '127.0.0.1', {
        rejectUnauthorized: false, // certificate has expired
      }, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> auth required/.test(inp)) {
            nc.write('ciao');
          } else if (/^> hello master/.test(inp)) {
            nc.write('fork\n');
          } else if (/^> [0-9]+ forked\n/.test(inp)) {
            pid = inp.match(/[0-9]+/);
            if (pid && (pid = pid[0])) {
              nc.write('kill ' + pid + '\n');
              reg = new RegExp('> ' + pid + ' killed\n');
            }
          } else if (reg.test(inp)) {
            nc.end(done);
          }
        });
      });
    });
    it('exit', function(done) {

      var nc = tls.connect(p, '127.0.0.1', {
        rejectUnauthorized: false, // certificate has expired
      }, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> auth required/.test(inp)) {
            nc.write('ciao');
          } else if (/^> hello master/.test(inp)) {
            nc.write('exit\n');
          }
        });
        nc.on('close', done);
      });
    });

    describe('error', function() {

      it('should throw an Exception if missing "listen"', function(done) {

        assert.throws(function() {

          task();
        }, function(err) {

          if ((err instanceof TypeError) && /listen required/.test(err)) {
            return true;
          }
        });
        done();
      });
      it('should throw an Exception if port is not a Integer', function(done) {

        assert.throws(function() {

          task('foobar', {
            output: false,
            tls: {}
          });
        }, function(err) {

          if ((err instanceof TypeError)
            && /required a port number for TLS connection/.test(err)) {
            return true;
          }
        });
        done();
      });
    });
  });
