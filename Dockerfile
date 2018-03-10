FROM node:9-alpine

ARG PUBLIC_URL=/admin
ARG REACT_APP_API_URL=http://api.knit.pk.edu.pl

ENV NODE_ENV production
ENV PUBLIC_URL ${PUBLIC_URL}
ENV REACT_APP_API_URL ${REACT_APP_API_URL}

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn install
RUN yarn build

# Note: Image is used only for building
