JSHINT := $(shell which jshint)
PHANTOMJS :=$(shell which phantomjs)

lint:
	$(JSHINT) src

test:
	$(PHANTOMJS) spec/vendor/mocha-phantomjs.coffee spec/mocha.html

.PHONY: lint test
