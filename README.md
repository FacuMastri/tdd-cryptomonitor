# Rostov's Crypto Monitor

Plataforma para monitorear los valores de criptomonedas, definir reglas de compra y venta que apliquen según las condiciones o variaciones del mercado.

Ver [README](/client/README.md) del cliente.

Ver [README](/server/README.md) del server.

## Integrantes

-   [Felipe de Luca](http://github.com/fdelu)
-   [Tomás Civini](http://github.com/ArmandoCivini)
-   [Facundo Mastricchio](http://github.com/FacuMastri)
-   [Elián Foppiano](http://github.com/efoppiano)
-   [Nicolás Zulaica](http://github.com/n-zu)

## Run with docker

The following env vars should be set on a `.env` file at the root of this directory:

-   `PORT`: Port to run the server on.
-   `WEB_PORT`: Port to run the client on.

The server also needs a `.env` file in its directory with other variables.

Then:

    docker-compose up --build

Will build the image for both server and client.
