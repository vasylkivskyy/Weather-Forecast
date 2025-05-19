FROM node:18-alpine

RUN apk add --no-cache build-base

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]