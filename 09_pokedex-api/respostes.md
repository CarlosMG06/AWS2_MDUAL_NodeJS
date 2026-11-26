# Activitat 9 · Respostes

Respon breument (2-4 línies) cada pregunta.

1. Compara `GET /material/<codi>` de l'activitat 6 (node:http) amb `GET /pokemon/:nom` (Express). Què et dona fet Express que abans havies d'escriure tu?

2. Comenta la línia `app.use(express.json())` i fes un `POST /preferits`. Què val `req.body`? Per què?

3. Per què el middleware del 404 va després de totes les rutes i el gestor d'errors és l'últim de tots?

4. Les rutes no fan cap `fetch`: tot passa per `pokeapi.js`. Quin avantatge té aquesta separació?

5. Si PokéAPI no respon, l'API retorna 502 i no 500. Quina diferència hi ha entre els dos codis?
