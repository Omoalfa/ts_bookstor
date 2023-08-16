# **BOOK STORE APP**
### Tilka assessment test app!!
Question link is [here](https://docs.google.com/document/d/1Ong4DZUe0Bp1HPw3I7twiBCWna-7gBsn0dBHL0tNwyQ/edit?pli=1)

## Requirements
- Nodejs - 14 or higher
- Postgresql

## Installation
- clone the app
- run `npm install`
- setup environment variables (use the .env.sample file)
- run `npm run migrate:latest`

## Run with Docker Compose
- make sure you have docker installed on your app
- setup the env file (use the .env.sample file as template)
- run docker --env-file .env up
- your app should be available on port 3000

*remember to create the database you are using before runing migrate:latest*

## Running The App
- you can either start the app in the dev environment using `npm run dev`
- or start in a prod env using `npm start`

## Postman Documentation
https://documenter.getpostman.com/view/22950696/2s9Xy6rVph

*developed by: [@Omoalfa](https://github.com/Omoalfa)*