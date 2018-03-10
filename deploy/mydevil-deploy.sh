#!/usr/bin/env sh

rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/build/ k911-main@s11.mydevil.net:/home/k911-main/domains/knit-test-api.tk/public_html/admin-on-rest
