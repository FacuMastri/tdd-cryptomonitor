# Crypto Monitor Client

## Development

### Requirements

- [Node.js](https://nodejs.org/en/)

### Commands

- `npm install` or `npm i` to install dependencies
- `npm run dev` to start in development mode
- `npm test` or `npm t` to run tests

- `npm run build` to build for production [TODO]
- `npm run lint` to run linter
- `npm run format` to run code formatter

### Run with Docker for demo

First, make sure the .env file is configured correctly as per the [instructions](#Environment-variables).

Then, go to `../server` and run:

    docker-compose up --build

Will build the image for both server and client.

### Environment variables

The following env vars should be set on a `.env` file at the root of this directory:

- `PORT`: Port to run the client on.