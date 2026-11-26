# pokedex-api · Activitat 9

API amb Express que fa d'intermediària amb [PokéAPI](https://pokeapi.co): demana les dades,
en treu el que interessa i les retorna en JSON net.

## Posada en marxa

```bash
npm install
npm run dev
```

Obre http://localhost:3000 al navegador. En un altre terminal:

```bash
npm run prova-api
```

## Rutes

| Mètode | Ruta | Què fa |
|---|---|---|
| GET | `/pokemon?limit=&offset=` | Llistat paginat (ve fet) |
| GET | `/pokemon?tipus=fire` | Només els d'un tipus (Pas 2) |
| GET | `/pokemon/:nom` | Un Pokémon simplificat (Pas 1) |
| GET | `/quin-pokemon-ets/:nom` | El teu Pokémon segons el teu nom (Pas 3) |
| GET | `/preferits` | Llista de preferits (Pas 4) |
| POST | `/preferits` | Afegeix un preferit: `{ "nom": "pikachu" }` (Pas 4) |
| DELETE | `/preferits/:nom` | Esborra un preferit (repte) |

## Sense connexió a PokéAPI

```bash
npm run pokeapi-local
```

Copia `.env.exemple` a `.env`, descomenta `POKEAPI_URL` i torna a engegar `npm run dev`.
