FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD [ "yarn", "run", "start" ]