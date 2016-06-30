#!/bin/bash

/usr/sbin/nginx -c /app/resources/nginx.conf -p /app/
cd /app && node src/index.js
