FROM node:12-alpine
WORKDIR /app
COPY package.json .

COPY . .
RUN npm install && npm run build && rm -r src
ARG BOT_VERSION
ENV BOT_VERSION=$BOT_VERSION
ENV AWS_REGION=us-west-2
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
CMD node build/index.js
