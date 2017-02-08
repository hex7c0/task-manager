'use strict';
/**
 * @file task-manager main
 * @module task-manager
 * @version 1.6.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
var cluster = require('cluster');
var fs = require('fs');

/*
 * command regex
 */
var commandRegex = /(\r)*(\n)*/g;
var exitRegex = /^exit[\r]?\n$/i;
var closeRegex = /^close[\r]?\n$/i;
var helpRegex = /^help[\r]?\n$/i;
var nyanRegex = /^nyan[\r]?\n$/;

/*
 * functions
 */
/**
 * modules builder
 * 
 * @returns {Object}
 */
function load() {

  var path = __dirname + '/min/lib/';
  var mod = Object.create(null);
  fs.readdirSync(path).forEach(function(module) {

    mod[module] = require(path + module);
    return;
  });

  return mod;
}

/**
 * TSL builder
 * 
 * @function wrapper
 * @param {Object} my - options
 * @return {Object}
 */
function wrapperTLS(my) {

  var tls = require('tls');
  var mod = load();
  var keys = Object.keys(mod);
  var ii = keys.length;

  /*
   * closure
   */
  /**
   * print to console. Warning if you use node with `&`
   * 
   * @param {String} [console] - output string
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
   * resume reading
   * 
   * @function resume
   * @param {Object} socket - socket connection
   */
  function resume(sock) {

    return sock.resume();
  }

  /**
   * print to console. Warning if you use node with `&`
   * 
   * @param {Object} sock - socket data
   * @param {String} string - message string
   * @param {Object} [object] - json data
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
        console.log('task manager bound at TLS:' + my.listen);
      }
      return;
    });
  }

  /**
   * body
   */
  var server = tls.createServer(my.tls, function(sock) {

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

      if (my.auth && grant === false) { // auth middleware
        if (command.replace(commandRegex, '') === my.auth) {
          grant = true;
          sock.write('> hello master\n', function() {

            output('client connected');
            return resume(sock);
          });

        } else {
          sock.write('> auth required\n', function() {

            output('client denied');
            return resume(sock);
          });
        }
        return;
      }

      for (var i = 0; i < ii; ++i) { // every lib
        var m = mod[keys[i]];
        if (m.regex.test(command) === true) {
          return m.body(sock, command, workers, next);
        }
      }

      if (my.custom && my.custom.test(command)) {
        my.callback(sock, command);
        return resume(sock);

      } else if (exitRegex.test(command)) {
        sock.end('> exit\n', function() {

          return server.close(function() {

            return output('exit');
          });
        });
        return process.exit(0);

      } else if (closeRegex.test(command)) {
        return sock.end('> close\n', function() {

          return server.close(function() {

            return output('close');
          });
        });

      } else if (helpRegex.test(command)) {
        index = '  disconnect [pid]\n';
        index += '  fork\n';
        index += '  kill [pid]\n';
        index += '  memory\n';
        index += '  ps\n';
        index += '  title [name]\n';
        index += '  uptime\n';
        index += '  exit\n';
        index += '  close\n';
        return sock.write(index, function() {

          return resume(sock);
        });

      } else if (nyanRegex.test(command)) {
        index = '-_-_-_-_-_-_-_,------,      o      \n';
        index += '_-_-_-_-_-_-_-|   /\\_/\\            \n';
        index += '-_-_-_-_-_-_-~|__( ^ .^)  +     +  \n';
        index += '_-_-_-_-_-_-_-""  ""               \n';
        return sock.write(index, function() {

          return resume(sock);
        });
      }

      return sock.write('> unrecognized, try "help"\n', function() {

        return resume(sock);
      });
    });
  });

  server.on('error', function(e) {

    if (e.code === 'EADDRINUSE' || e.code === 'ECONNREFUSED') {
      setTimeout(function() {

        return start(false);
      }, 1000);
    }
    return;
  });

  return start(true);
}

/**
 * TCP builder
 * 
 * @function wrapper
 * @param {Object} my - options
 * @return {Object}
 */
function wrapperTCP(my) {

  var net = require('net');
  var mod = load();
  var keys = Object.keys(mod);
  var ii = keys.length;

  /*
   * closure
   */
  /**
   * print to console. Warning if you use node with `&`
   * 
   * @param {String} [console] - output string
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
   * resume reading
   * 
   * @function resume
   * @param {Object} socket - socket connection
   */
  function resume(sock) {

    return sock.resume();
  }

  /**
   * print to console. Warning if you use node with `&`
   * 
   * @param {Object} sock - socket data
   * @param {String} string - message string
   * @param {Object} [object] - json data
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
        console.log('task manager bound at TCP:' + my.listen);
      }
      return;
    });
  }

  /**
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

      if (my.auth && grant === false) { // auth middleware
        if (command.replace(commandRegex, '') === my.auth) {
          grant = true;
          sock.write('> hello master\n', function() {

            output('client connected');
            return resume(sock);
          });

        } else {
          sock.write('> auth required\n', function() {

            output('client denied');
            return resume(sock);
          });
        }
        return;
      }

      for (var i = 0; i < ii; ++i) { // every lib
        var m = mod[keys[i]];
        if (m.regex.test(command) === true) {
          return m.body(sock, command, workers, next);
        }
      }

      if (my.custom && my.custom.test(command)) {
        my.callback(sock, command);
        return resume(sock);

      } else if (exitRegex.test(command)) {
        sock.end('> exit\n', function() {

          return server.close(function() {

            return output('exit');
          });
        });
        return process.exit(0);

      } else if (closeRegex.test(command)) {
        return sock.end('> close\n', function() {

          return server.close(function() {

            return output('close');
          });
        });

      } else if (helpRegex.test(command)) {
        index = '  disconnect [pid]\n';
        index += '  fork\n';
        index += '  kill [pid]\n';
        index += '  memory\n';
        index += '  ps\n';
        index += '  title [name]\n';
        index += '  uptime\n';
        index += '  exit\n';
        index += '  close\n';
        return sock.write(index, function() {

          return resume(sock);
        });

      } else if (nyanRegex.test(command)) {
        index = '-_-_-_-_-_-_-_,------,      o      \n';
        index += '_-_-_-_-_-_-_-|   /\\_/\\            \n';
        index += '-_-_-_-_-_-_-~|__( ^ .^)  +     +  \n';
        index += '_-_-_-_-_-_-_-""  ""               \n';
        return sock.write(index, function() {

          return resume(sock);
        });
      }

      return sock.write('> unrecognized, try "help"\n', function() {

        return resume(sock);
      });
    });
  });

  server.on('error', function(e) {

    if (e.code === 'EADDRINUSE' || e.code === 'ECONNREFUSED') {
      if (~~my.listen === 0) { // domain socket
        fs.unlink(my.listen, function(err) {

          if (err) {
            throw err;
          }
          return start(false);
        });
      } else { // tcp port
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
 * UDP builder
 * 
 * @function wrapper
 * @param {Object} my - options
 * @return {Object}
 */
function wrapperUDP(my) {

  var dgram = require('dgram');
  var mod = load();
  var keys = Object.keys(mod);
  var ii = keys.length;

  /*
   * closure
   */
  /**
   * print to console. Warning if you use node with `&`
   * 
   * @param {String} [console] - output string
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
   * send a message to UDP client
   * 
   * @param {String} string - message string. cast to Buffer
   * @param {Object} sock - client socket data
   * @param {Function} [next] - next callback
   */
  function write(string, sock, next) {

    var message = new Buffer(string);
    return sock.server.send(message, 0, message.length, sock.port,
      sock.address, function(err) {

        return next ? next(err) : null;
      });
  }

  /**
   * print to console. Warning if you use node with `&`
   * 
   * @param {Object} sock - socket data
   * @param {String} string - message string
   * @param {Object} [object] - json data
   */
  var next = function(sock, string) {

    return write(string, sock);
  };
  if (my.json) {
    next = function(sock, string, object) {

      return write(JSON.stringify(object), sock);
    };
  }

  /**
   * 'listening' listener
   * 
   * @param {Boolean} print - if print info
   */
  function start(print) {

    return server.bind(my.listen, function() {

      if (print) {
        console.log('task manager bound at UDP:' + my.listen);
      }
      return;
    });
  }

  /**
   * body
   */
  var server = dgram.createSocket('udp4', function(buff, sock) {

    sock.server = server; // dgram socket
    var index;
    var command = String(buff);
    var workers = cluster.workers;

    for (var i = 0; i < ii; ++i) { // every lib
      var m = mod[keys[i]];
      if (m.regex.test(command) === true) {
        return m.body(sock, command, workers, next);
      }
    }

    if (my.custom && my.custom.test(command)) {
      my.callback(sock, command);
      return;

    } else if (exitRegex.test(command)) {
      write('> exit\n', sock, function() {

        return server.close(function() {

          return output('exit');
        });
      });
      return process.exit(0);

    } else if (closeRegex.test(command)) {
      return write('> close\n', sock, function() {

        return server.close(function() {

          return output('close');
        });
      });

    } else if (helpRegex.test(command)) {
      index = '  disconnect [pid]\n';
      index += '  fork\n';
      index += '  kill [pid]\n';
      index += '  memory\n';
      index += '  ps\n';
      index += '  title [name]\n';
      index += '  uptime\n';
      index += '  exit\n';
      index += '  close\n';
      return write(index, sock);

    } else if (nyanRegex.test(command)) {
      index = '-_-_-_-_-_-_-_,------,      o      \n';
      index += '_-_-_-_-_-_-_-|   /\\_/\\            \n';
      index += '-_-_-_-_-_-_-~|__( ^ .^)  +     +  \n';
      index += '_-_-_-_-_-_-_-""  ""               \n';
      return write(index, sock);
    }

    return write('> unrecognized, try "help"\n', sock, null, server);
  });

  server.on('error', function(e) {

    if (e.code === 'EADDRINUSE' || e.code === 'ECONNREFUSED') {
      setTimeout(function() {

        return start(false);
      }, 1000);
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

  if (Boolean(options.udp) === true) { // upd
    if (~~what === 0) { // 0 if not a number
      throw new TypeError('required a port number for UDP connection');
    }
    return wrapperUDP(my);

  } else if (typeof options.tls === 'object') { // tls
    if (~~what === 0) { // 0 if not a number
      throw new TypeError('required a port number for TLS connection');
    }
    my.tls = options.tls;
    return wrapperTLS(my);
  }

  return wrapperTCP(my); // tcp
}
module.exports = task;
