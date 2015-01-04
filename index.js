'use strict';
/**
 * @file task-manager main
 * @module task-manager
 * @package task-manager
 * @subpackage main
 * @version 1.0.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
  var cluster = require('cluster');
  var unlink = require('fs').unlink;
  var net = require('net');
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}

/*
 * functions
 */
/**
 * resume reading
 * 
 * @function resume
 * @param {Object} socket - socket connection
 */
function resume(sock) {

  return sock.resume();
}

/**
 * function wrapper for multiple require
 * 
 * @function wrapper
 * @param {Object} my - options
 * @return {Object}
 */
function wrapper(my) {

  /*
   * closure
   */
  /**
   * print to console. Warning if you use node with `&`
   * 
   * @param {String} console - output string
   */
  var output = function() {

    return;
  };
  if (my.output) {
    output = function(consolle) {

      return console.log(consolle);
    };
  }

  /**
   * 'listening' listener
   * 
   * @param {Boolean} print - if print info
   */
  function start(print) {

    server.listen(my.listen, function() {

      if (print) {
        console.log('task manager bound at ' + my.listen);
      }
      return;
    });
    return;
  }

  // 'connection' listener
  var server = net.createServer(function(sock) {

    var grant = false;

    sock.on('end', function() {

      if (my.auth) {
        grant = false;
      }
      return output('client disconnected');
    });
    sock.on('data', function(buff) {

      sock.pause();
      var command = String(buff);

      if (my.auth && grant === false) {
        if (command.replace(/(\n)*(\r)*/g, '') === my.auth) {
          grant = true;
          sock.write('> hello master\n', function() {

            output('client connected');
          });
        } else {
          sock.write('> auth required\n', function() {

            output('client denied');
          });
        }
        return resume(sock);
      }

      var i, index, pid;
      var temp = cluster.workers;
      if (/^(kill|swap)/.test(command)) {
        pid = command.match(/[0-9]+\n/);
        if (pid && (pid = Number(pid[0]))) {
          for (i in temp) {
            index = temp[i];
            if (index.process.pid === pid) {
              index.kill();
              sock.write('> ' + pid + ' killed\n');
              return resume(sock);
            }
          }
          sock.write('> child\'s pid not found\n');
          return resume(sock);
        }
        var c = 0;
        for (i in temp) {
          temp[i].kill();
          c++;
        }
        sock.write('> ' + c + ' killed\n');
        return resume(sock);
      }
      if (/^disconnect/.test(command)) {
        pid = command.match(/[0-9]+\n/);
        if (pid && (pid = Number(pid[0]))) {
          for (i in temp) {
            index = temp[i];
            if (index.process.pid === pid) {
              index.disconnect();
              var timeout = setTimeout(function() { // zombie killer

                return index.kill();
              }, 5000);
              index.on('disconnect', function() { // YOLO

                return clearTimeout(timeout);
              });
              sock.write('> ' + pid + ' disconnect\n');
              return resume(sock);
            }
          }
        }
        sock.write('> child\'s pid not found\n');
        return resume(sock);
      }
      if (/^fork[\r]?\n/.test(command)) {
        pid = cluster.fork();
        sock.write('> ' + pid.process.pid + ' forked\n');
        return resume(sock);
      }
      if (/^ps[\r]?\n/.test(command)) {
        var str = '> father pid: ' + process.pid + '\n';
        for (i in temp) {
          str += '> child pid: ' + temp[i].process.pid + '\n';
        }
        sock.write(str);
        return resume(sock);
      }
      if (/^(quit|exit)[\r]?\n$/.test(command)) {
        sock.end('> goodbye\n', function() {

          return server.close(function() {

            return output('shutting down');
          });
        });
        return process.exit(0);
      }
      if (/^close[\r]?\n$/.test(command)) {
        return sock.end('> bye\n', function() {

          return server.close(function() {

            return output('closing task-manager');
          });
        });
      }
      if (/^help[\r]?\n$/.test(command)) {
        sock.write('  kill|swap [pid]\n');
        sock.write('  disconnect pid\n');
        sock.write('  fork\n');
        sock.write('  ps\n');
        sock.write('  quit|exit\n');
        sock.write('  close\n');
        return resume(sock);
      }
      if (my.custom && my.custom.test(command)) {
        my.callback(sock, command);
        return resume(sock);
      }
      sock.write('> unrecognized, try "help"\n');
      return resume(sock);
    });

    if (my.auth) {
      if (grant) {
        sock.write('> hello master\n', function() {

          return output('client connected');
        });
      } else {
        sock.write('> auth required\n');
      }
    } else {
      sock.write('> hello master\n');
    }
    return;
  });

  server.on('error', function(e) {

    if (e.code === 'EADDRINUSE') {
      if (isNaN(my.listen)) {
        unlink(my.listen, function(err) {

          if (err) {
            throw err;
          }
          start(false);
          return;
        });
      } else {
        setTimeout(function() {

          start(false);
        }, 1000);
      }
    }
    return;
  });

  start(true);
}

/**
 * options setting
 * 
 * @exports task
 * @function task
 * @param {Number|String} listen - listen type
 * @param {Object} [opt] - various options. Check README.md
 * @return {Object}
 */
function task(listen, opt) {

  if (!listen) {
    throw new TypeError('listen required');
  }
  var what = Number(listen) || String(listen);

  var options = opt || Object.create(null);
  var my = {
    listen: what,
    output: options.output === true ? true : false,
    auth: Boolean(options.auth) ? String(options.auth) : false,
    custom: Boolean(options.custom) ? options.custom : false,
    callback: options.callback
  };
  if (my.custom && typeof (my.callback) === 'function') {
    if (!my.custom.source) {
      my.custom = new RegExp(my.custom);
    }
  } else {
    my.custom = false;
  }
  return wrapper(my);
}
module.exports = task;
