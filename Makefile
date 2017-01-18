default: run

WORKSPACE_DIR ?= workspace
BUILD_DIR = $(WORKSPACE_DIR)/build

.PHONY: app frontend build run

app:
	yarn install

frontend:
	make -C frontend compile

build:
	docker build -t lunch-roulette .

watch:
	cd frontend && make watch

exec:
	docker exec -it lunch-roulette bash

PGHOST=db
PGPORT=5432

run:
	docker rm -f lunch-roulette || true
	docker run \
		--name lunch-roulette \
		-v $(shell pwd)/src:/app/src \
		-v $(shell pwd)/resources:/app/resources \
		-v $(shell pwd)/node_modules:/app/node_modules \
		-e SLACK_TEAM=$$SLACK_TEAM \
		-e SLACK_CLIENT_ID=$$SLACK_CLIENT_ID \
		-e SLACK_CLIENT_SECRET=$$SLACK_CLIENT_SECRET \
		-e MAP_URL=$$MAP_URL \
		-e MAP_MASK_URL=$$MAP_MASK_URL \
		--link lunch-roulette-db:$(PGHOST) \
		-e PGHOST=$(PGHOST) \
		-e PGPORT=$(PGPORT) \
		-p 0.0.0.0:80:80 \
		-p 0.0.0.0:443:443 \
		-it lunch-roulette
