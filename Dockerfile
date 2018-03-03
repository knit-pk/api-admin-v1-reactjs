FROM node:9-alpine

ARG PUBLIC_URL=https://knit-test-api.tk/admin
ARG REACT_APP_API_URL=https://knit-test-api.tk

ENV PUBLIC_URL ${PUBLIC_URL}
ENV REACT_APP_API_URL ${REACT_APP_API_URL}

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn --prod install
RUN yarn build

# Note: Image is used only for building
