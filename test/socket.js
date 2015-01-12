'use strict';
/**
 * @file socket test
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
    var task = require('..'); // use require('task-manager')
    var assert = require('assert');
    var fs = require('fs');
    var net = require('net');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
var p = 'test.sock';

/*
 * test module
 */
describe('socket', function() {

    describe('client', function() {

        it('auth', function(done) {

            var c = 0;
            var nc = net.connect(p, function() {

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
                        nc.end();
                        done();
                    }
                });
            });
        });

        it('unrecognized', function(done) {

            var c = 0;
            var nc = net.connect(p, function() {

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
                            nc.end();
                            done();
                        }
                    }
                });
            });
        });

        it('ps', function(done) {

            var nc = net
                    .connect(p, function() {

                        nc.setNoDelay(true);
                        nc
                                .on('data', function(buff) {

                                    var inp = String(buff);
                                    if (/^> auth required/.test(inp)) {
                                        nc.write('ciao');
                                    } else if (/^> hello master/.test(inp)) {
                                        nc.write('ps\n');
                                    } else if (/^> father pid: [0-9]+\n> child pid: [0-9]+\n> child pid: [0-9]+\n/
                                            .test(inp)) {
                                        nc.end();
                                        done();
                                    }
                                });
                    });
        });

        it('fork', function(done) {

            var pid;
            var reg = new RegExp('nope');
            var nc = net.connect(p, function() {

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
                        nc.end();
                        done();
                    }
                });
            });
        });

        it('swap', function(done) {

            var nc = net.connect(p, function() {

                nc.setNoDelay(true);
                nc.on('data', function(buff) {

                    var inp = String(buff);
                    if (/^> auth required/.test(inp)) {
                        nc.write('ciao');
                    } else if (/^> hello master/.test(inp)) {
                        nc.write('swap\n');
                    } else if (/^> 2 killed\n/.test(inp)) {
                        nc.end();
                        done();
                    }
                });
            });
        });

        it('quit', function(done) {

            var nc = net.connect(p, function() {

                nc.setNoDelay(true);
                nc.on('data', function(buff) {

                    var inp = String(buff);
                    if (/^> auth required/.test(inp)) {
                        nc.write('ciao');
                    } else if (/^> hello master/.test(inp)) {
                        nc.write('quit\n');
                    }
                });
                nc.on('close', function() {

                    done();
                });
            });
        });
    });

    describe('remove', function() {

        it('sock', function(done) {

            fs.unlink(p, function(err) {

                if (err)
                    throw err;
                done();
            });
        });
    });
});
