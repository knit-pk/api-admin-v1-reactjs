FROM node:10-alpine

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-alpine-linux-amd64-${DOCKERIZE_VERSION}.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-${DOCKERIZE_VERSION}.tar.gz \
    && rm dockerize-alpine-linux-amd64-${DOCKERIZE_VERSION}.tar.gz

ENV NODE_ENV='production' \
    PUBLIC_URL='{{{ .Env.PUBLIC_URL }}}' \
    REACT_APP_API_URL='{{{ .Env.REACT_APP_API_URL }}}'

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install

COPY . /usr/src/app

# Build and create template files for dockerize
RUN yarn build && \
    ASSETS_VERSION=$(cat build/asset-manifest.json | grep "\"main.js\"" | sed -E "s/\s+\"main.js\": \"static\/js\/main\.(.*)\.js\",/\1/") && \
    cp build/index.html build/index.html.tmpl && \
    cp build/service-worker.js build/service-worker.js.tmpl && \
    cp build/static/js/main.$ASSETS_VERSION.js build/static/js/main.$ASSETS_VERSION.js.tmpl && \
    cp build/static/js/main.$ASSETS_VERSION.js.map build/static/js/main.$ASSETS_VERSION.js.map.tmpl

# Set environment variables in build files provided via --build-args using dockerize
# Remarks: You can also use bellow code in your derrived Dockerfile to change app's environment variables
ARG ADMIN_PUBLIC_URL='/admin'
ARG ADMIN_API_URL='http://api.knit.pk.edu.pl'
ENV PUBLIC_URL=${ADMIN_PUBLIC_URL} \
    REACT_APP_API_URL=${ADMIN_API_URL}

RUN ASSETS_VERSION=$(cat build/asset-manifest.json | grep "\"main.js\"" | sed -E "s/\s+\"main.js\": \"static\/js\/main\.(.*)\.js\",/\1/") && \
    dockerize -delims "{{{:}}}" \
      -template build/index.html.tmpl:build/index.html \
      -template build/service-worker.js.tmpl:build/service-worker.js \
      -template build/static/js/main.$ASSETS_VERSION.js.tmpl:build/static/js/main.$ASSETS_VERSION.js \
      -template build/static/js/main.$ASSETS_VERSION.js.map.tmpl:build/static/js/main.$ASSETS_VERSION.js.map
