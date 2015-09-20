'use strict';
/**
 * @file commands test
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
var p = 20001;

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
          nc.end(done);
        }
      });
    });
  });

  describe('father', function() {

    it('memory', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('memory\n');
          } else {
            assert.equal(typeof JSON.parse(inp), 'object');
            nc.end(done);
          }
        });
      });
    });
    it('uptime', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('uptime\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(typeof j.uptime, 'number');
            nc.end();
            done();
          }
        });
      });
    });
    it('get name', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('title\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(j.name, 'node');
            nc.end(done);
          }
        });
      });
    });
    it('set name', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('title Ciao\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(j.name, 'Ciao');
            nc.end();
            done();
          }
        });
      });
    });
    it('get name again', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('title\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(j.name, 'Ciao');
            nc.end(done);
          }
        });
      });
    });
    it('set right name', function(done) {

      var nc = net.connect(p, function() {

        nc.setNoDelay(true);
        nc.on('data', function(buff) {

          var inp = String(buff);
          if (/^> hello master/.test(inp)) {
            nc.write('title node\n');
          } else {
            var j = JSON.parse(inp);
            assert.equal(j.name, 'node');
            nc.end(done);
          }
        });
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
            nc.end(done);
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
            var j = JSON.parse(inp);
            assert.equal(typeof j.father, 'number');
            assert.equal(Array.isArray(j.child), true);
            assert.ok(j.child.indexOf(pid) >= 0);
            assert.equal(j.child.length, workers.length + 1);
            assert.notDeepEqual(j.child, workers);
            assert.equal(j.father, father);
            workers = j.child;
            nc.end(done);
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
            nc.end(done);
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
              nc.end(done);
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
            nc.end(done);
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
              nc.end(done);
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
            nc.end(done);
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
              nc.end(done);
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
            nc.end(done);
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
              nc.end(done);
            }
          });
        });
      }, 500);
    });
  });

});
