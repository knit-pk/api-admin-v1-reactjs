#!/usr/bin/env sh

if [[ $(git name-rev --name-only --tags HEAD) = "$APP_VERSION" ]]; then
  echo "Already tagged. Skipping.."
  exit
fi

conventional-changelog -p angular -i CHANGELOG.md -s -r 0
git add CHANGELOG.md
git commit -m "chore(release): ${APP_VERSION} :tada:

$(conventional-changelog)
"

git tag ${APP_VERSION}

git remote add authorized https://travis:${GH_TOKEN}@github.com/knit-pk/api-admin-v1-reactjs.git
git push authorized HEAD:master --tags

conventional-github-releaser -p angular -t ${GH_TOKEN}
