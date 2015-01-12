#!/bin/bash

cd test/

# run server in background
node server/callback.js &
node server/commands.js &
node server/socket.js &
node server/tcp.js &

# killer
mocha -b --check-leaks *.js