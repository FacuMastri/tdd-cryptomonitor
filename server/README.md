# Crypto Monitor Server

## Development

### Requirements

- [Node.js](https://nodejs.org/en/)

### Run with Docker for development

First time:

```bash
docker-compose -f docker-compose-dev.yml up --build
```

Subsequent times:

```bash
docker-compose -f docker-compose-dev.yml up
```

### Running test within Docker

Once the container is up and running, run the following commands:

```bash
docker exec -it server bash
```

Once inside the container, run:

```bash
$ root@f55080179d84:/app# ls
Dockerfile-dev  README.md  docker-compose-dev.yml  jest.config.js  node_modules  nodemon.json  package-lock.json  package.json  src  tests  tsconfig.json
$ root@f55080179d84:/app# npm t
```

### Run with Docker for demo

First, make sure the .env file is configured correctly as per the [instructions](#Environment-variables).

Then:

    docker-compose up --build

Will build the image for both server and client.

### Commands

- `npm install` or `npm i` to install dependencies
- `npm start` to start in development mode
- `npm test` or `npm t` to run tests

- `npm run build` to build for production [TODO]
- `npm run lint` to run linter
- `npm run format` to run code formatter

- `npm run schemas` to update JSON schemas

### Environment variables

The following env vars should be set on a `.env` file at the root of this directory:

- `PORT`: Port to run the server on
- `CLI_PORT`: Port to run the client on
- `BINANCE_API_KEY`: Binance API key. It could be obtained from [here](https://www.binance.com/en/my/settings/api-management)
- `BINANCE_API_SECRET`: Binance API secret. It could be obtained from [here](https://www.binance.com/en/my/settings/api-management)
- `JWT_SECRET` [optional]: Secret to sign JWT tokens. If not set, 'mysecret' will be set as default.
- `JWT_EXPIRATION` [optional]: Expiration time for JWT tokens. If not set, it will default to 30d. Available formats could be found [here](ea5c52512b5d)
