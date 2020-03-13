FROM node:12-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build && rm -r src

CMD node build/index.js
