# Activitat 5 · Suggeriments de la IA

Els suggeriments que ha proposat la IA són els següents:

1. Corregir la gestió d'errors en desar un préstec.

2. Respondre `400` davant JSON invàlid o camps absents. 

3. Evitar pèrdues amb préstecs concurrents. 

4. Vincular l'esdeveniment de préstec amb la petició.

5. Reduir l'exposició de credencials i dades en logs.

6. Fer més sòlida la importació CSV. 

7. Fer que la consulta de logs toleri entrades buides o incompletes. 

8. Proves amb `node:test` per JSON mal format, camps absents, errors d'escriptura i préstecs concurrents del mateix element.

## Resposta exacta

Aquesta és la resposta exacta de la IA amb tots els detalls:

>Estas son las mejoras que priorizaría:
>
>1. **Corregir el manejo de errores al guardar un préstamo.** En el callback de `material.desarAsync`, se llama a `enviarError(res, err)`, aunque la función requiere `(req, res, err)`. Si falla la escritura, el propio manejador puede lanzar otra excepción. Pasa los tres argumentos en `servidor.js:43-48`.
>
>2. **Responder `400` ante JSON inválido o campos ausentes.** Un cuerpo mal formado y casos como `persona` ausente pueden acabar como `500`: `JSON.parse` lanza una excepción y el acceso a `persona.email` también puede fallar. Valida el JSON y la estructura de entrada antes de procesarla, y devuelve un error de cliente con un mensaje seguro. Esto está en `servidor.js:30-40` y en el procesamiento del cuerpo de la petición (`servidor.js:77-87`).
>
>3. **Evitar pérdidas con préstamos concurrentes.** Dos peticiones simultáneas pueden partir del mismo `inventari`, aprobar el préstamo del mismo elemento y escribir versiones distintas del archivo; una respuesta podría confirmar un préstamo que no queda guardado. Serializa las mutaciones y considera persistir mediante archivo temporal y renombrado atómico. La lógica implicada está en `servidor.js:42-48` y `material.js:31-33`.
>
>4. **Vincular el evento de préstamo con la petición.** El registro `logger.info` usa el logger global, mientras que las peticiones tienen `req.log` con `reqId`. Usar el logger de la petición permitiría relacionar el evento de negocio con el registro HTTP correspondiente (`servidor.js:42-48`).
>
>5. **Reducir la exposición de credenciales y datos en logs.** El token tiene un valor por defecto predecible (`servidor.js:8-9`); para un despliegue real convendría exigir una variable de entorno. Además, `ruta: req.url` registra también la query completa (`servidor.js:59-64`); registrar solo la ruta puede evitar que parámetros sensibles lleguen al log. La redacción de Pino ayuda, pero no sustituye a limitar qué datos se registran.
>
>6. **Hacer más sólida la importación CSV.** `importa.js` divide líneas y campos con `split`, lo que falla con comillas, separadores dentro de valores o saltos de línea en campos; también acepta solo una opción y puede ignorar argumentos adicionales. Un parser CSV y una validación explícita de argumentos harían el comportamiento más predecible (`importa.js:11-20`, `importa.js:45-62`).
>
>7. **Hacer que la consulta de logs tolere entradas vacías o incompletas.** `consulta.js` asume que el archivo contiene líneas válidas y que siempre hay peticiones con estados `500`, `401` y al menos una petición para el `reduce`. Conviene aceptar la ruta como argumento y manejar esos casos vacíos; esto mejora el script sin depender del contenido actual de `logs/` (`consulta.js`).
>
>Como comprobación, añadiría pruebas con `node:test` para JSON mal formado, campos ausentes, errores de escritura y dos préstamos concurrentes del mismo elemento.

## Aplicació de suggeriments

Després de l'implementació de les propostes, aquesta és la explicació que dona la IA sobre les eines emprades:

>Se usaron APIs nativas de Node.js y la librería Pino que ya tenía el proyecto.
>
>| # | Sugerencia | Herramientas y cómo se aplicaron | Archivos tocados |
>|---|---|---|---|
>| 1 | Gestionar errores al guardar un préstamo | Se envolvió el callback de `desarAsync` en una `Promise`, para poder esperar el resultado y propagar los errores al manejador `enviarError(req, res, err)` con sus argumentos correctos. | `servidor.js`, `material.js` |
>| 2 | Responder `400` ante JSON inválido o campos ausentes | `JSON.parse` se protege con `try/catch`; después se validan el objeto recibido y los campos `id`, `persona`, `email` y `nom`. Los errores de validación llevan `status = 400`. | `servidor.js` |
>| 3 | Evitar pérdidas con préstamos concurrentes | Una cola basada en `Promise` (`cuaPrestecs`) serializa las peticiones de préstamo. La escritura usa `fs.writeFile` en un temporal único —con `crypto.randomUUID()`— y luego `fs.rename` para publicar el inventario atómicamente. | `servidor.js`, `material.js`, `test/servidor.test.js` |
>| 4 | Vincular el evento de préstamo con la petición | Se registra el préstamo con `req.log.info`, el logger Pino asociado a la petición y al `reqId`; así se puede relacionar con el log HTTP de finalización. | `servidor.js` |
>| 5 | Reducir la exposición de credenciales y datos en logs | El servidor y el generador de tráfico requieren `TOKEN` del entorno y ya no usan un valor por defecto. El log registra solo el `pathname`, sin la query. Pino aplica redacción a correos, autorizaciones y tokens. | `servidor.js`, `trafic.js`, `logger.js`, `README.md` |
>| 6 | Hacer más sólida la importación CSV | Se implementó `parseCSV`, que contempla campos entre comillas, separadores y saltos de línea dentro de campos y comillas escapadas. También se validan argumentos, cabecera y número de columnas; los registros pasan por `material.crear`. | `importa.js` |
>| 7 | Hacer que la consulta de logs tolere entradas vacías o incompletas | `consulta.js` acepta una ruta opcional, ignora líneas vacías y avisa si una línea NDJSON no se puede analizar. Comprueba los campos antes de usarlos y contempla que no haya errores 500/401 o peticiones con tiempo. | `consulta.js` |
>| 8 | Añadir pruebas con `node:test` | Se usaron `node:test`, `node:assert/strict` y `fetch` para probar JSON mal formado, campos ausentes, errores de escritura y dos préstamos concurrentes del mismo elemento. Se añadió el script `npm test`. | `test/servidor.test.js`, `package.json`, `README.md` |
>
>Sobre el `Promise` seleccionado: convierte el callback de guardado en una operación que se puede esperar. Así la cola no procesa el siguiente préstamo hasta que termine la escritura, y un fallo llega al manejador de errores en vez de confirmar el préstamo.