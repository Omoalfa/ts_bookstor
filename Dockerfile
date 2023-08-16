# syntax = docker/dockerfile:1.2

FROM node:17

WORKDIR /app

COPY ./package.json .

RUN npm cache clean --force
RUN npm install
RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env cat /etc/secrets/.env

COPY . .

EXPOSE 3000

# CMD npm start
CMD [ "npm", "start" ]
