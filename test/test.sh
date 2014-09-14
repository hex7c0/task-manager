#!/bin/bash

cd test/

# run server in background
node server/socket.js &
node server/tcp.js &

# killer
mocha --bail --check-leaks *.js