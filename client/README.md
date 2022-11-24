# Crypto Monitor Client

## Diseño

La página esta hecha con el framework React en TypeScript. El código se organiza de manera sencilla en 3 carpetas:

- `screens`: Contiene los componentes de las diferentes pantallas/páginas de la aplicación.
- `util`: Contiene otros componentes y funciones de utilidad.
- `styles`: Contiene los archivos `.css` utilizados.

También utilizamos `SWR` para facilitar la obtención de datos desde el backend con sus hooks, `MUI` para algunos componentes especiales como buscadores, `react-toastify` para mostrar toasts para informar cambios o errores, `react-ace` para el editor de JSONs para las reglas, `jwt-decode` para obtener información del usuario a partir de su token y `@react-oauth/google` para la autenticación con Google.

Se consideró el uso de `Redux`, pero se decidió no utilizarlo ya que nos pareció que la complejidad de la página no ameritaba su uso.

## Pantallas

- **Login**: Pantalla de login. Permite ingresar con email y contraseña o con Google.
- **Dashboard**: Información general de la aplicación. Tiene una tabla que muestra los balances de las monedas con un promedio histórico y un historial de transacciones.
- **Rules**: Permite configurar las reglas a ejecutar para un símbolo y estados específicos.
- **Policies**: Permite configurar los parámetros de diferentes poíticas que definen el estado de cada moneda y si se debe operar sobre esta o no.
- **Variables**: Permite definir las variables a utilizar en las reglas.

## Desarrollo

### Requisitos

- [Node.js](https://nodejs.org/en/)

### Comandos

- `npm install` o `npm i` para instalar dependencias
- `npm run dev` para iniciar en modo desarrollo
- `npm run build` para buildear el proyecto
- `npm run lint` para ejecutar el linter
- `npm run format` para ejecuar el formatter

### Ejecutar con Docker

Asegurarse que el archivo .env esta configurado correctamente según las [instrucciones](#Environment-variables).

Luego, ir a la carpeta `../server` y ejecutar:

    `docker-compose up --build`

Este comando va a buildear las imagenes para el servidor y para el cliente.