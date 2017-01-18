default: compile

.PHONY: install compile prod-compile watch

install:
	yarn install

compile: install
	./node_modules/webpack/bin/webpack.js \
		--progress --colors

prod-compile: install
	MINIFY=1 ./node_modules/webpack/bin/webpack.js \
		--progress --colors

watch:
	./node_modules/webpack/bin/webpack.js \
		--progress --colors --watch
