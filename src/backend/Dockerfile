FROM node:10

WORKDIR /src/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
