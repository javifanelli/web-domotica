FROM node:lts-alpine3.12

RUN npm install --global nodemon

RUN npm install --global cors

RUN npm install --global jsonwebtoken

WORKDIR /src/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
