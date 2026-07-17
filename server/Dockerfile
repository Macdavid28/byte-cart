# use the official node.js LTS Image
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8090

CMD [ "npm","run", "server" ]