# Rostov's Crypto Monitor

Plataforma para monitorear los valores de criptomonedas, definir reglas de compra y venta que apliquen según las condiciones o variaciones del mercado

Ver [docs](/docs/)

Ver [enunciado](https://docs.google.com/document/d/1YWHSMlHjrVZ6HAVEERuD4IdhdI54ica8IvILpKLGT24/edit)

Ver [README](/client/README.md) del cliente.

Ver [README](/server/README.md) del server.

## Run with docker

The following env vars should be set on a `.env` file at the root of this directory:

- `PORT`: Port to run the server on.
- `WEB_PORT`: Port to run the client on.

The server also needs a `.env` file in its directory with other variables.

Then:

    `docker-compose up --build`

Will build the image for both server and client.
