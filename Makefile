JSHINT :=./node_modules/.bin/jshint

lint: $(JSHINT); $(JSHINT) src

.PHONY: lint
