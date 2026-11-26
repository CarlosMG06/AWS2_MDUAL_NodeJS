# PokéAPI local

Una còpia de [PokéAPI](https://pokeapi.co) que funciona **sense internet**: les mateixes rutes
i el mateix format, amb les dades dels 1.025 Pokémon i dels seus tipus guardades a `dades/`.
Serveix per fer l'activitat 9 quan la xarxa del centre no deixa arribar a pokeapi.co.

No té cap dependència: no cal `npm install`.

## Engegar-la

```bash
cd pokeapi-local
npm start
```

Surt alguna cosa com:

```
PokéAPI local amb 1025 Pokémon
  En aquest ordinador:  http://localhost:3999/api/v2
  Des de l'aula:        http://192.168.1.50:3999/api/v2
```

Comprova-ho al navegador: http://localhost:3999/api/v2/pokemon/pikachu

Per fer servir un altre port: `PORT=4000 npm start` (a Windows PowerShell: `$env:PORT=4000; npm start`).

## Connectar-hi el projecte de l'activitat 9

Al projecte `09_pokedex-api/`, copia `.env.exemple` com a `.env` i deixa-hi aquesta línia:

```
POKEAPI_URL=http://localhost:3999/api/v2
```

Torna a engegar `npm run dev`. Ja no cal `npm run pokeapi-local` (aquella només té 15 Pokémon).

## Una sola còpia per a tota l'aula

El docent l'engega al seu ordinador i l'alumnat posa al seu `.env` l'adreça «Des de l'aula»:

```
POKEAPI_URL=http://192.168.1.50:3999/api/v2
```

Si no hi arriben, el tallafoc de l'ordinador del docent ha de permetre connexions entrants al port 3999
(Windows ho pregunta la primera vegada que s'engega).

## Rutes

| Ruta | Què retorna |
|---|---|
| `/api/v2/pokemon?limit=20&offset=0` | Llista paginada (`count`, `next`, `previous`, `results`) |
| `/api/v2/pokemon/pikachu` o `/api/v2/pokemon/25` | Un Pokémon |
| `/api/v2/type` | Llista de tipus |
| `/api/v2/type/fire` | Els Pokémon d'un tipus |
| `/sprites/pokemon/25.png` | Imatge de 96 × 96 |

## Diferències amb la PokéAPI real

- Només les 1.025 espècies (de l'1 al 1.025), sense formes alternatives (megaevolucions, formes regionals…).
- Només els camps que fa servir l'activitat: `id`, `name`, `height`, `weight`, `types`, `stats` i `sprites`.
- Les imatges són les petites (96 × 96) i es serveixen des d'aquest mateix servidor;
  `sprites.other["official-artwork"].front_default` val `null`.
- Les URLs de les respostes apunten a aquest servidor, no a pokeapi.co.

## Origen de les dades

Dades del projecte [PokeAPI](https://github.com/PokeAPI/api-data) (llicència BSD 3-Clause) i imatges del
repositori [PokeAPI/sprites](https://github.com/PokeAPI/sprites). Pokémon i les seves imatges són
propietat de Nintendo, Game Freak i The Pokémon Company; aquí es fan servir amb finalitat educativa.
