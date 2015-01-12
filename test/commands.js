'use strict';
/**
 * @file commands test
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
describe('commands', function() {

  var father;
  var workers;

  it('ps', function(done) {

    var nc = net.connect(p, function() {

      nc.setNoDelay(true);
      nc.on('data', function(buff) {

        var inp = String(buff);
        if (/^> hello master/.test(inp)) {
          nc.write('ps\n');
        } else {
          var j = JSON.parse(inp);
          assert.equal(typeof j.father, 'number');
          assert.equal(Array.isArray(j.child), true);
          father = j.father;
          workers = j.child;
          nc.end();
          done();
        }
      });
    });
  });

  describe('fork', function() {

    var pid;
    it('fork', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('fork\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(typeof j.fork, 'number');
            pid = j.fork;
            nc.end();
            done();
          }
        });
      });
    });
    it('ps', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('ps\n');
          } else {
            inp = JSON.parse(inp);
            assert.equal(typeof inp.father, 'number');
            assert.equal(Array.isArray(inp.child), true);
            assert.ok(inp.child.indexOf(pid) >= 0);
            assert.equal(inp.child.length, workers.length + 1);
            assert.notDeepEqual(inp.child, workers);
            workers = inp.child;
            nc.end();
            done();
          }
        });
      });
    });
  });

  describe('kill', function() {

    it('kill all', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('kill\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(j.kill, workers.length);
            nc.end();
            done();
          }
        });
      });
    });
    it('ps', function(done) {

      setTimeout(function() { // wait for autorestart

        var nc = net.connect(p, function() {

          nc.setNoDelay(true);
          nc.on('data', function(buff) {

            var inp = String(buff);
            if (/^> hello master/.test(inp)) {
              nc.write('ps\n');
            } else {
              inp = JSON.parse(inp);
              assert.equal(typeof inp.father, 'number');
              assert.equal(Array.isArray(inp.child), true);
              assert.equal(inp.child.length, workers.length);
              assert.notDeepEqual(inp.child, workers);
              workers = inp.child;
              nc.end();
              done();
            }
          });
        });
      }, 500);
    });
    it('kill one', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('kill ' + workers[0] + '\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(j.kill, workers[0]);
            nc.end();
            done();
          }
        });
      });
    });
    it('ps', function(done) {

      setTimeout(function() { // wait for autorestart

        var nc = net.connect(p, function() {

          nc.setNoDelay(true);
          nc.on('data', function(buff) {

            var inp = String(buff);
            if (/^> hello master/.test(inp)) {
              nc.write('ps\n');
            } else {
              inp = JSON.parse(inp);
              assert.equal(typeof inp.father, 'number');
              assert.equal(Array.isArray(inp.child), true);
              assert.equal(inp.child.length, workers.length);
              assert.notDeepEqual(inp.child, workers);
              workers = inp.child;
              nc.end();
              done();
            }
          });
        });
      }, 500);
    });
  });

  describe('disconnect', function() {

    it('disconnect all', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('disconnect\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(j.disconnect, workers.length);
            nc.end();
            done();
          }
        });
      });
    });
    it('ps', function(done) {

      setTimeout(function() { // wait for autorestart

        var nc = net.connect(p, function() {

          nc.setNoDelay(true);
          nc.on('data', function(buff) {

            var inp = String(buff);
            if (/^> hello master/.test(inp)) {
              nc.write('ps\n');
            } else {
              inp = JSON.parse(inp);
              assert.equal(typeof inp.father, 'number');
              assert.equal(Array.isArray(inp.child), true);
              assert.equal(inp.child.length, workers.length);
              assert.notDeepEqual(inp.child, workers);
              workers = inp.child;
              nc.end();
              done();
            }
          });
        });
      }, 500);
    });
    it('disconnect one', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('disconnect ' + workers[0] + '\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(j.disconnect, workers[0]);
            nc.end();
            done();
          }
        });
      });
    });
    it('ps', function(done) {

      setTimeout(function() { // wait for autorestart

        var nc = net.connect(p, function() {

          nc.setNoDelay(true);
          nc.on('data', function(buff) {

            var inp = String(buff);
            if (/^> hello master/.test(inp)) {
              nc.write('ps\n');
            } else {
              inp = JSON.parse(inp);
              assert.equal(typeof inp.father, 'number');
              assert.equal(Array.isArray(inp.child), true);
              assert.equal(inp.child.length, workers.length);
              assert.notDeepEqual(inp.child, workers);
              workers = inp.child;
              nc.end();
              done();
            }
          });
        });
      }, 500);
    });
  });

});
