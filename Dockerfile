FROM node:12-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build && rm -r src
ARG BOT_VERSION
ENV BOT_VERSION=$BOT_VERSION
CMD node build/index.js
