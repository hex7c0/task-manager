'use strict';
/**
 * @file callback test
 * @module task-manager
 * @package task-manager
 * @subpackage test
 * @version 0.0.1
 * @author carniellifrancesco <carniellifrancesco@gmail.com>
 * @copyright gruppore 2014
 */

/*
 * initialize module
 */
// import
try {
  var assert = require('assert');
  var net = require('net');
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}
// load
var p = 20000;

/*
 * test module
 */
describe('callback', function() {

  describe('client', function() {

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
            nc.end();
            done();
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
});
