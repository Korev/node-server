#!/bin/sh

set -xe

docker build -t izettleserver .
docker run -p 8080:8080 -v ${PWD}/db:/app/db izettleserver