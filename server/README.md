# Crypto Monitor Server

## Development

### Requirements

- [Node.js](https://nodejs.org/en/)

### Run with Docker

First time:

```bash
docker-compose up --build
```

Subsequent times:

```bash
docker-compose up
```

### Running test within Docker

Once the container is up and running, run the following commands:

```bash
docker exec -it server bash
```

Once inside the container, run:

```bash
$ root@f55080179d84:/app# ls
Dockerfile  README.md  docker-compose.yml  jest.config.js  node_modules  nodemon.json  package-lock.json  package.json  src  tests  tsconfig.json
$ root@f55080179d84:/app# npm t
```

### Commands

- `npm install` or `npm i` to install dependencies
- `npm start` to start in development mode
- `npm test` or `npm t` to run tests

- `npm run build` to build for production [TODO]
- `npm run lint` to run linter
- `npm run format` to run code formatter

- `npm run schemas` to update JSON schemas
