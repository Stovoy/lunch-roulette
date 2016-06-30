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
	docker rm -f lunch-roulette || true

watch:
	make -C frontend watch

run: build
	docker run \
		--name lunch-roulette \
		-v $(shell pwd)/resources:/app/resources \
		-p 0.0.0.0:8000:8000 \
		-t lunch-roulette
