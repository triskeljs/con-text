
.PHONY: test release

install:
	npm install

eslint:
	$(shell npm bin)/eslint eval.js
	$(shell npm bin)/eslint interpolate-processor.js
	$(shell npm bin)/eslint con-text.js
	$(shell npm bin)/eslint tests

test: install eslint
	@$(shell npm bin)/mocha tests

npm.publish:
	git pull --tags
	npm version patch
	git push origin $(git_branch) && git push --tags
	npm publish --access public

github.release: export REPOSITORY=triskeljs/con-text
github.release: export PKG_VERSION=$(shell node -e "console.log('v'+require('./package.json').version);")
github.release: export RELEASE_URL=$(shell curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${GITHUB_TOKEN}" \
	-d '{"tag_name": "${PKG_VERSION}", "target_commitish": "$(git_branch)", "name": "${PKG_VERSION}", "body": "", "draft": false, "prerelease": false}' \
	-w '%{url_effective}' "https://api.github.com/repos/${REPOSITORY}/releases" )
github.release:
	@echo ${RELEASE_URL}
	@echo "\nhttps://github.com/${REPOSITORY}/releases/tag/${PKG_VERSION}\n"

release: test npm.publish github.release
