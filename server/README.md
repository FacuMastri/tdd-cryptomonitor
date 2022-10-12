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
$ docker ps
CONTAINER ID   IMAGE                          COMMAND                  CREATED         STATUS              PORTS                                       NAMES
f55080179d84   server_crypto-monitor-server   "docker-entrypoint.s…"   6 minutes ago   Up About a minute   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   server_crypto-monitor-server_1
```

Copy the container ID and then:

```bash
docker exec -it [container-id] bash
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
