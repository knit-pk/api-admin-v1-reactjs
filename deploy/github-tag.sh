#!/usr/bin/env sh

git tag ${APP_VERSION} --force

git remote add authorized https://travis:${GH_TOKEN}@github.com/knit-pk/api-admin-v1-reactjs.git
git push authorized ${APP_VERSION} --force
