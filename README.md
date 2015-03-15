# [task-manager](http://supergiovane.tk/#/task-manager)

[![NPM version](https://img.shields.io/npm/v/task-manager.svg)](https://www.npmjs.com/package/task-manager)
[![Linux Status](https://img.shields.io/travis/hex7c0/task-manager.svg?label=linux)](https://travis-ci.org/hex7c0/task-manager)
[![Windows Status](https://img.shields.io/appveyor/ci/hex7c0/task-manager.svg?label=windows)](https://ci.appveyor.com/project/hex7c0/task-manager)
[![Dependency Status](https://img.shields.io/david/hex7c0/task-manager.svg)](https://david-dm.org/hex7c0/task-manager)
[![Coveralls](https://img.shields.io/coveralls/hex7c0/task-manager.svg)](https://coveralls.io/r/hex7c0/task-manager)

Task-manager for cluster or single application

Use `nc` for [Unix domain socket](http://en.wikipedia.org/wiki/Unix_domain_socket)

Use `telnet` or `TCP` software for `TCP port`


## Installation

Install through NPM

```bash
npm install task-manager
```
or
```bash
git clone git://github.com/hex7c0/task-manager.git
```

## API

inside nodejs project
```js
var task = require('task-manager');

task('s.sock'); // use unix domain socket
```

open client for send commands
```bash
$ nc -U s.sock
```

### commands

show all commands
```bash
help
```

[disconnect](http://nodejs.org/api/cluster.html#cluster_worker_disconnect) all children
```bash
disconnect
```

[disconnect](http://nodejs.org/api/cluster.html#cluster_worker_disconnect) selected child, with his pid
```bash
disconnect 8564
```

[fork](http://nodejs.org/api/cluster.html#cluster_cluster_fork_env) a new child
```bash
fork
```

[kill](http://nodejs.org/api/cluster.html#cluster_worker_kill_signal_sigterm) all children
```bash
kill
```

[kill](http://nodejs.org/api/cluster.html#cluster_worker_kill_signal_sigterm) selected child, with his pid
```bash
kill 8564
```

get father [memory](http://nodejs.org/api/process.html#process_process_memoryusage)
```bash
memory
```

show all [pids](http://nodejs.org/api/process.html#process_process_pid)
```bash
ps
```

get father [title](http://nodejs.org/api/process.html#process_process_title)
```bash
title
```

set father [title](http://nodejs.org/api/process.html#process_process_title)
```bash
title Ciao
```

get father [uptime](http://nodejs.org/api/process.html#process_process_uptime)
```bash
uptime
```

process [exit](http://nodejs.org/api/process.html#process_process_exit_code)
```bash
exit
```

close TCP/socket listener
```bash
close
```

### task(listen [, options])

#### listen

 - `listen`- **Number | String** Number for `TCP port`, String (path) for `sock` *(default "required")*

#### [options]

 - `auth` - **String** Accept commands only if `auth` is correct *(default "disabled")*
 - `output`- **Boolean** Flag for print info to console (main process) *(default "disabled")*
 - `custom`- **String | RegExp** Custom validation for client command (after built-in command) *(default "disabled")*
 - `callback`- **Function** Execute this function, if `custom` command is accepted (socket and command as arguments) *(default "disabled")*
 - `json`- **Boolean** Flag for print info in JSON *(default "disabled")*

## Examples

Take a look at my [examples](examples)

### [License GPLv3](LICENSE)
