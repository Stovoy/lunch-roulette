#!/bin/bash

/usr/sbin/nginx -c /app/resources/nginx.conf -p /app/
cd /app
(
	cd frontend
	MINIFY=1 ./node_modules/webpack/bin/webpack.js --progress
)

if [[ "$MODE" == "dev" ]]; then
	./node_modules/nodemon/bin/nodemon.js src/index.js
elif [[ "$MODE" == "release" ]]; then
	nodejs src/index.js
fi
