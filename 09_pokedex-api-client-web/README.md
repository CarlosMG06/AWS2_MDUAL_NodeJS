# pokedex-api-client-web · Activitat 9

Client web (HTML, CSS i JavaScript, sense cap framework) per a l'API de l'activitat 9.
Mostra la Pokédex, filtra per tipus, obre la fitxa de cada Pokémon, respon a «Quin Pokémon ets?»
i gestiona els preferits.

## Engegar-ho

Calen dos terminals (tres si fas servir la PokéAPI local):

```bash
# Terminal 1 · l'API de l'activitat 9
cd 09_pokedex-api
npm run dev

# Terminal 2 · aquest client
cd 09_pokedex-api-client-web
npm start
```

Obre http://localhost:5173 al navegador.

`npm install` només cal per al lint (`npm run lint`): el servidor no té cap dependència.

## Com es connecta amb l'API

```
Navegador ──► client web (localhost:5173) ──► API (localhost:3000) ──► PokéAPI
              fitxers de public/ i proxy /api
```

- El navegador només parla amb `localhost:5173`.
- Tot el que comença per `/api` el servidor del client ho reenvia a l'API:
  `GET /api/pokemon/25` → `GET http://localhost:3000/pokemon/25`.
- Com que el navegador no canvia d'origen, l'API no necessita CORS.

Si l'API és en un altre lloc, copia `.env.exemple` com a `.env` i canvia `API_URL`.

## Estructura

```
09_pokedex-api-client-web/
├── servidor.js        fitxers estàtics + proxy /api (node:http, sense dependències)
└── public/
    ├── index.html     les tres vistes i la fitxa (<dialog>)
    ├── css/estils.css
    └── js/
        ├── api.js         totes les crides a l'API (fetch)
        ├── components.js  de JSON a elements HTML (textContent, mai innerHTML)
        └── app.js         estat, esdeveniments i navegació
```

## Rutes de l'API que fa servir

| Pantalla | Petició |
|---|---|
| Pokédex | `GET /pokemon?limit=12&offset=0` i `GET /pokemon/:id` per a cada targeta |
| Filtre per tipus | `GET /pokemon?tipus=fire&limit=12&offset=0` |
| Cerca i fitxa | `GET /pokemon/:nom` |
| Quin Pokémon ets? | `GET /quin-pokemon-ets/:nom` |
| Preferits | `GET /preferits`, `POST /preferits` i `DELETE /preferits/:nom` |

L'esborrat de preferits fa servir `DELETE /preferits/:nom`, que és el repte opcional de l'activitat:
funciona amb la versió resolta.

## Compartir «Quin Pokémon ets?»

L'enllaç té la forma `http://localhost:5173/?ets=Marta`: en obrir-lo, la pàgina mostra el resultat directament.
Per compartir-lo amb algú de l'aula, canvia `localhost` per la IP del teu ordinador.
