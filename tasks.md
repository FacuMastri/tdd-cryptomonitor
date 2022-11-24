## Tasks

- [x] arreglar los tests rotos
- [x] monitorear los valores de criptomonedas
- [x] monitorear la variación del valor de una criptomoneda frente a otra
- [x] unico Rules por cada simbolo y status
- [x] que se ejecuten acciones predefinidas
- [x] ir guardando las acciones de compra/venta para despues mostrarlas
- [x] mostrar error de parseo de reglas aparte
- [x] compartir reglas
- [ ] (opcional) notificaciones de transacciones
- [ ] docs
- [ ] docker
- [ ] tests

  - [ ] test de los services internos (?)
  - [ ] post de reglas

## Enunciado

- [ ] Objetivos:

  - [x] Permitir configurar monedas para operar y monitorear valores.
  - [ ] Permitir consultar promedios históricos de los últimos 2 días. Por ejemplo: 60 minutos, 8 horas, 1 día, etc.
  - [ ] Permitir configurar criterios para definir el estado del mercado de cierta moneda frente a otra en base a la variación de la moneda en cierto tiempo. Los posibles estados son: En Suba, En Baja, Estable basado en los valores promedio diarios de los últimos X días.
  - [ ] Permitir configurar criterios para definir el estado de la cartera para cierta moneda según el valor actual frente a un valor. Operable. No Operable. Es decir si la moneda está por arriba de cierto valor, se opera con las reglas, si esta por debajo de ese valor no quiero operar.
  - [ ] Permitir definir estrategias, un conjunto de acciones a utilizar (agresiva, random, conservadora, etc) que se pueden configurar para ser utilizadas según el estado del mercado. Por ejemplo si el mercado está ESTABLE, usar estrategias de mercado estable, si está en EN SUBA, usar las en suba,.

- [ ] Valores:

  - [x] Monitorear y guardar cada cambio de más de un 0.1% de las monedas seleccionadas (para evitar cambios insignificantes).
  - [x] Consultar el estado de la wallet y conocer sus montos.
  - [x] Permitir crear valores fijos con nombre.
  - [ ] Permitir crear valores promedios, por ejemplo el valor promedio de la moneda X respecto a la Y de los últimos 15 minutos, 60 minutos etc.
  - [ ] Permitir obtener el valor actual de una moneda, el valor que tuvo en cierta fecha, o el promedio en cierto periodo.

- [x] Reglas:
  - [x] Se componen de condiciones en que se activan, y acciones a realizar una vez activadas.
  - [x] Son serializables a una estructura JSON, a definir por el cliente.
  - [x] Pueden hacer uso de cotizaciones históricas de las monedas, como valores numéricos o lista de los mismos.
  - [x] Pueden hacer uso de constantes y variables en tiempo de ejecución, consultándolas y (en caso de las variables) modificándolas.
  - [x] Permiten aplicar un conjunto de funciones predeterminadas para realizar cálculos aritméticos y comparaciones entre valores.
  - [x] Por el momento, las acciones a considerar son: BUY_MARKET , SELL_MARKET , SET_VARIABLE

> Delete this file when finished
