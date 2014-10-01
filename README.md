# [task-manager](http://supergiovane.tk/#/task-manager)

[![NPM version](https://badge.fury.io/js/task-manager.svg)](http://badge.fury.io/js/task-manager)
[![Build Status](https://travis-ci.org/hex7c0/task-manager.svg)](https://travis-ci.org/hex7c0/task-manager)
[![Dependency Status](https://david-dm.org/hex7c0/task-manager/status.svg)](https://david-dm.org/hex7c0/task-manager)

Task-manager for cluster or single application.
Use `nc` for [Unix domain socket](http://en.wikipedia.org/wiki/Unix_domain_socket).
Use `telnet` or `TCP` software for `TCP port`.


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

task('s.sock');

// make other
```

open client for send commands
```bash
$ nc -U s.sock
```

### commands

kill all children (equal to `swap`)
```bash
kill
```

kill selected child, with his pid (equal to `swap`)
```bash
kill 8564
```

fork a new child
```bash
fork
```

show all pids
```bash
ps
```

process quit (equal to `exit`)
```bash
quit
```

close TCP/socket listener
```bash
close
```

### task(listen,[options])

#### listen

 - `listen`- **Number | String** Number for `TCP port`, String (path) for `sock` *(default "required")*

#### [options]

 - `auth` - **String** Accept commands only if `auth` is the same *(default "disabled")*
 - `output`- **Boolean** Flag for print info to console *(default "disabled")*
 - `custom`- **String | RegExp** Custom validation for client command (after built-in command) *(default "disabled")*
 - `callback`- **Function** Execute this function, if `custom` command is accepted (socket and command as arguments) *(default "disabled")*

## Examples

Take a look at my [examples](https://github.com/hex7c0/task-manager/tree/master/examples)

### [License GPLv3](http://opensource.org/licenses/GPL-3.0)
