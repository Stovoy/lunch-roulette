#!/bin/bash

/usr/sbin/nginx -c /app/resources/nginx.conf -p /app/
cd /app && nodejs src/index.js
