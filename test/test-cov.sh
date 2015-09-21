#!/bin/bash

cd test/

# run server in background
node server/callback.js &
node server/commands.js &
node server/socket.js &
node server/tcp.js &
node server/udp.js &
node server/tls.js &

# killer
istanbul cover ../node_modules/mocha/bin/_mocha --report lcovonly -- *.js
