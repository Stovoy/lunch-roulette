WORKSPACE_DIR ?= workspace
BUILD_DIR = $(WORKSPACE_DIR)/build

.PHONY: app frontend build run

default: run

app:
	npm install

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
		-e SLACK_CLIENT_ID=$$SLACK_CLIENT_ID \
		-e SLACK_CLIENT_SECRET=$$SLACK_CLIENT_SECRET \
		--link lunch-roulette-db:$(PGHOST) \
		-e PGHOST=$(PGHOST) \
		-e PGPORT=$(PGPORT) \
		-p 0.0.0.0:80:80 \
		-p 0.0.0.0:443:443 \
		-it lunch-roulette
