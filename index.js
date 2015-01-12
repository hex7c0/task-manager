'use strict';
/**
 * @file task-manager main
 * @module task-manager
 * @package task-manager
 * @subpackage main
 * @version 1.1.0
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
  var fs = require('fs');
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
   * print to console. Warning if you use node with `&`
   * 
   * @param {String} console - output string
   */
  var next = function(sock, string) {

    sock.write(string, function() {

      return sock.resume();
    });
  };
  if (my.json) {
    next = function(sock, string, object) {

      sock.write(JSON.stringify(object), function() {

        return sock.resume();
      });
    };
  }
  /**
   * 'listening' listener
   * 
   * @param {Boolean} print - if print info
   */
  function start(print) {

    return server.listen(my.listen, function() {

      if (print) {
        console.log('task manager bound at ' + my.listen);
      }
      return;
    });
  }
  /**
   * modules
   */
  var path = __dirname + '/lib/';
  var mod = Object.create(null);
  fs.readdirSync(path).forEach(function(module) {

    mod[module] = require(path + module);
  });

  /*
   * body
   */
  var server = net.createServer(function(sock) {

    var grant = false;
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

    return sock.on('end', function() {

      if (my.auth) {
        grant = false;
      }
      return output('client disconnected');
    }).on('data', function(buff) {

      sock.pause();
      var index;
      var command = String(buff);
      var workers = cluster.workers;

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

      for ( var m in mod) {
        if (mod[m].regex.test(command) === true) {
          return mod[m].body(sock, command, workers, next);
        }
      }

      if (my.custom && my.custom.test(command)) {
        my.callback(sock, command);
        return resume(sock);
      } else if (/^exit[\r]?\n$/.test(command)) {
        sock.end('> exit\n', function() {

          return server.close(function() {

            return output('exit');
          });
        });
        return process.exit(0);
      } else if (/^close[\r]?\n$/.test(command)) {
        return sock.end('> close\n', function() {

          return server.close(function() {

            return output('close');
          });
        });
      } else if (/^help[\r]?\n$/.test(command)) {
        index = '  kill [pid]\n';
        index += '  disconnect [pid]\n';
        index += '  fork\n';
        index += '  ps\n';
        index += '  exit\n';
        index += '  close\n';
        sock.write(index);
        return resume(sock);
      } else if (/^nyan[\r]?\n$/.test(command)) {
        index = '-_-_-_-_-_-_-_,------,      o      \n';
        index += '_-_-_-_-_-_-_-|   /\\_/\\            \n';
        index += '-_-_-_-_-_-_-~|__( ^ .^)  +     +  \n';
        index += '_-_-_-_-_-_-_-""  ""               \n';
        sock.write(index);
        return resume(sock);
      }

      sock.write('> unrecognized, try "help"\n');
      return resume(sock);
    });
  });

  server.on('error', function(e) {

    if (e.code === 'EADDRINUSE') {
      if (isNaN(my.listen)) {
        fs.unlink(my.listen, function(err) {

          if (err) {
            throw err;
          }
          return start(false);
        });
      } else {
        setTimeout(function() {

          return start(false);
        }, 1000);
      }
    }
    return;
  });

  return start(true);
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
    callback: options.callback,
    json: Boolean(options.json)
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
