#!/bin/bash -e

check_vars() {
	WANTED_VARS=(
		"MODE"
		"SLACK_TEAM" "SLACK_CLIENT_ID" "SLACK_CLIENT_SECRET"
		"MAP_URL" "MAP_MASK_URL"
	)
	local EXIT=0
	for VAR in "${WANTED_VARS[@]}"; do
		if [ -z "${!VAR}" ]; then
			EXIT=1
			echo "Missing $VAR."
		fi
	done
	if [[ "$EXIT" -eq 1 ]]; then
		exit 1
	fi
}

check_vars

mkdir -p /app/resources/map
curl -so /app/resources/map/map.svg "$MAP_URL"
curl -so /app/resources/map/map-mask.png "$MAP_MASK_URL"

/usr/sbin/nginx -c /app/resources/nginx.conf -p /app/
cd /app

if [[ "$MODE" == "dev" ]]; then
	./node_modules/nodemon/bin/nodemon.js src/index.js
elif [[ "$MODE" == "release" ]]; then
	(
		make -C frontend prod-compile
	)
	nodejs src/index.js
fi
