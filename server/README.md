# Crypto Monitor Server

## Diseño

El servidor está hecho en Node.js con Express. El código se organiza, principalmente, en 4 carpetas:

- `controllers`: Contiene los controladores de las rutas.
- `interpreter`: Contiene el intérprete de las reglas.
- `repositories`: Contiene los repositorios de los datos (usuarios, reglas, variables).
Se definieron interfaces que permiten cambiar la implementación de los repositorios sin afectar el resto del código.
En este caso, se implementaron en memoria.
- `services`: Contiene los servicios de la aplicación, tales como:
  - Autenticación, con JWT (`UserService`).
  - Comunicación con la API de Binance (`BinanceService`).
  - Comunicación con el websocket de Binance y ejecución de las reglas (`MonitorService`).
  - Organización de reglas de acuerdo a los símbolos y estados (`InterpreterService`).

## Decisiones de diseño

- El cálculo de la variación de un símbolo, para determinar si se encuentra en ALZA, BAJA o ESTABLE, es el siguiente:
  - Se obtienen todos los precios válidos en el intervalo definido por el usuario.
  - Se calcula el máximo (**M**) y el mínimo (**m**) de estos precios.
  - Se calcula la variación como **(M - m) / m**.
  - Si la variación es mayor a **variationPerc** (definido en las política para ese símbolo),
  se considera que el símbolo está en ALZA.
  - Si la variación es menor a **-variationPerc**, se considera que el símbolo está en BAJA.
  - De lo contrario, se considera que el símbolo está ESTABLE.
Pueden encontrarse ejemplos de funcionamiento en `test/services/monitor.tests.ts`.

- La evaluación de reglas solo se realiza cuando ocurren los siguientes eventos:
  - Ocurre una variación significativa en el precio de algún símbolo. Esto se determina a partir de un valor
    definido en el archivo de configuración.
  - La cartera se encuentra operable. Esto se determina a partir de un `opCriteria`, definido con un símbolo y un valor,
  que pueden configurarse por el usuario.
  Si el valor del símbolo es mayor al valor del `opCriteria`, la cartera se considera operable.
  De lo contrario, se considera no operable.

## Desarrollo

### Requerimientos

- [Node.js](https://nodejs.org/en/)

### Correr con Docker para desarrollo

Primera vez:

```bash
docker-compose -f docker-compose-dev.yml up --build
```

Veces posteriores:

```bash
docker-compose -f docker-compose-dev.yml up
```

### Correr tests con Docker

Una vez que el container está en funcionamiento, ejecutar los siguientes comandos:

```bash
docker exec -it server bash
```

Una vez dentro del contenedor, ejecutar:

```bash
$ root@f55080179d84:/app# ls
Dockerfile-dev  README.md  docker-compose-dev.yml  jest.config.js  node_modules  nodemon.json  package-lock.json  package.json  src  tests  tsconfig.json
$ root@f55080179d84:/app# npm t
```

### Corrida de Docker para la demo

Primero, asegurarse de que el archivo `.env` esté configurado correctamente
según las [instrucciones](#Environment-variables).

Luego:

    docker-compose up --build

Buildeará las imágenes para el servidor y para el cliente.

### Comandos

- `npm install` o `npm i` para instalar las dependencias
- `npm start` para iniciar en modo desarrollo
- `npm test` o `npm t` para correr los tests

- `npm run lint` para correr el linter
- `npm run format` para correr el formateador de código

- `npm run schemas` para actualizar los esquemas JSON

### Variables de entorno

Las siguientes variables de entorno deben ser configuradas en el archivo `.env` en
la raíz de ésta carpeta:

- `PORT`: Puerto en el que correr el servidor.
- `CLI_PORT`: Puerto en el que correr el ciente.
- `BINANCE_API_KEY`: API key de Binance. Puede ser obtenida de [aquí](https://www.binance.com/en/my/settings/api-management)
- `BINANCE_API_SECRET`: API secret de Binance. Puede ser obtenido de [aquí](https://www.binance.com/en/my/settings/api-management)
- `JWT_SECRET` [optional]: Secret para firmar los tokens JWT. Si no se encuentra seteado, se usará 'mysecret' por default.
- `JWT_EXPIRATION` [optional]: Tiempo de expiración de los tokens JWT. Si no está seteado, se usará 30d por default. Los formatos aceptados pueden ser encontrados [aquí](ea5c52512b5d)
