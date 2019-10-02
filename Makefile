
.PHONY: test release

ifndef NPM_VERSION
  export NPM_VERSION=patch
endif

default: install test build

install:
	npm install

lint:
	npx eslint src

test: lint
	npx mocha --require @babel/register src/*.test.js

build:
	rm -rf dist
	npx babel src --out-dir dist --ignore src/**/*.test.js
	cp package.json dist
	cp README.md dist

npm.publish:
	git pull --tags
	npm version patch
	git push origin $(git_branch) && git push --tags
	npm publish dist --access public

github.release: export REPOSITORY=triskeljs/con-text
github.release: export PKG_VERSION=$(shell node -e "console.log('v'+require('./package.json').version);")
github.release: export RELEASE_URL=$(shell curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${GITHUB_TOKEN}" \
	-d '{"tag_name": "${PKG_VERSION}", "target_commitish": "$(git_branch)", "name": "${PKG_VERSION}", "body": "", "draft": false, "prerelease": false}' \
	-w '%{url_effective}' "https://api.github.com/repos/${REPOSITORY}/releases" )
github.release:
	@echo ${RELEASE_URL}
	@echo "\nhttps://github.com/${REPOSITORY}/releases/tag/${PKG_VERSION}\n"

release: install test build npm.publish github.release
