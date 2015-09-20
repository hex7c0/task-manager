'use strict';
/**
 * @file callback test
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
var net = require('net');
var p = 20000;

/*
 * test module
 */
describe('callback', function() {

  it('callback', function(done) {

    var nc = net.connect(p, function() {

      nc.setNoDelay(true);
      nc.on('data', function(buff) {

        var inp = String(buff);
        if (/^> auth required/.test(inp)) {
          nc.write('ciao');
        } else if (/^> hello master/.test(inp)) {
          nc.write('parrot\n');
        } else if (/^parrot\n/.test(inp)) {
          nc.write('parrot pingu\n');
        } else if (/^parrot pingu\n/.test(inp)) {
          nc.end(done);
        }
      });
    });
  });
  it('exit', function(done) {

    var nc = net.connect(p, function() {

      nc.setNoDelay(true);
      nc.on('data', function(buff) {

        var inp = String(buff);
        if (/^> auth required/.test(inp)) {
          nc.write('ciao');
        } else if (/^> hello master/.test(inp)) {
          nc.write('exit\n');
        }
      });
      nc.on('close', function() {

        done();
      });
    });
  });
});
