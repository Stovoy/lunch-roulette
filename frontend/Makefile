all: compile

install:
	npm install

compile: install
	./node_modules/webpack/bin/webpack.js \
		--progress --colors

min-compile: install
	MINIFY=1 ./node_modules/webpack/bin/webpack.js \
		--progress --colors

watch:
	./node_modules/webpack/bin/webpack.js \
		--progress --colors --watch

dev:
	./node_modules/webpack-dev-server/bin/webpack-dev-server.js \
		--content-base ../resources/ \
		--hot --progress --colors --inline
