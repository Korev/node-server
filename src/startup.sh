#!/bin/sh

set -xe

if [ ! -f db/users.db ]; then
    touch db/users.db
fi

npm install -g node-pre-gyp
npm install

node server.js