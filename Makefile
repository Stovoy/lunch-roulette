default: build run

WORKSPACE_DIR ?= workspace
BUILD_DIR = $(WORKSPACE_DIR)/build

.PHONY: app frontend watch build exec run

app:
	yarn install

frontend:
	make -C frontend compile

watch:
	make -C frontend watch

build:
	docker build -t lunch-roulette .

exec:
	docker exec -it lunch-roulette sh

SOURCE_DIR ?= $(shell pwd)
PGHOST=db
PGPORT=5432

run:
	docker rm -f lunch-roulette || true
	docker run \
		--name lunch-roulette \
		-v $(SOURCE_DIR)/src:/app/src \
		-v $(SOURCE_DIR)/resources:/app/resources \
		-v $(SOURCE_DIR)/node_modules:/app/node_modules \
		-e SLACK_TEAM=$$SLACK_TEAM \
		-e SLACK_CLIENT_ID=$$SLACK_CLIENT_ID \
		-e SLACK_CLIENT_SECRET=$$SLACK_CLIENT_SECRET \
		-e MAP_URL=$$MAP_URL \
		-e MAP_MASK_URL=$$MAP_MASK_URL \
		--link lunch-roulette-db:$(PGHOST) \
		-e PGHOST=$(PGHOST) \
		-e PGPORT=$(PGPORT) \
		-p 0.0.0.0:80:80 \
		-it lunch-roulette
