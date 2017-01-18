default: compile

.PHONY: deps compile prod-compile watch

deps:
	yarn install

compile:
	./node_modules/webpack/bin/webpack.js \
		--progress --colors

prod-compile:
	MINIFY=1 ./node_modules/webpack/bin/webpack.js \
		--progress --colors

watch:
	./node_modules/webpack/bin/webpack.js \
		--progress --colors --watch
