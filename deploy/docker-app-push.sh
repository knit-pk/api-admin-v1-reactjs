#!/usr/bin/env sh

DOCKER_TAG=$(echo ${TRAVIS_TAG} | sed -E 's~^v(.*)~\1~')

# Docker Hub
echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin

docker pull knitpk/api-admin:latest

docker build . \
    --cache-from knitpk/api-admin:latest \
    --tag knitpk/api-admin:${DOCKER_TAG} \
    --tag knitpk/api-admin:latest

docker push knitpk/api-admin:${DOCKER_TAG}
docker push knitpk/api-admin:latest
