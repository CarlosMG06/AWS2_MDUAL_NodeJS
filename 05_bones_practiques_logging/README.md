# Activitat 5 · Bones pràctiques de logging

Dues aplicacions de l'inventari de l'aula que funcionen, però que no deixen saber què ha passat quan alguna cosa va malament:

- `importa.js`: una CLI que afegeix a l'inventari el material d'un CSV de compra.
- `servidor.js`: l'API de l'inventari (consultar material i fer préstecs).

En aquesta activitat n'arreglem els logs: primer a la CLI, després al servidor amb **pino**, i al final els fem servir per investigar una incidència.

## Posada en marxa

1. Copia la carpeta `bones-practiques-logging/` a l'arrel del teu repositori del curs (`node-curs/`), al costat de les carpetes de les activitats anteriors. **No facis `git init`**: el repositori ja existeix.
2. Des de `bones-practiques-logging/`, instal·la les dependències i crea `data/material.json`:

```
npm install
npm run reset
```

3. Desa el punt de partida:

```
git add .
git commit -m "Activitat 5 · Punt de partida"
git push
```

## Què hi ha

| Fitxer | Què és |
| --- | --- |
| `importa.js` | La CLI que has d'arreglar (passos 2 i 3) |
| `servidor.js` | L'API que has d'arreglar (passos 4, 5 i 6) |
| `material.js` | La lògica de l'inventari. Ve fet |
| `trafic.js` | Simula un matí de peticions a l'API. Ve fet |
| `exemples/` | Un model executable per a cada pas |
| `respostes.md` | Les preguntes del Pas 1 i del Pas 6 |
| `data/compra-octubre.csv` | La compra que cal importar (té files amb errors) |
| `data/material.original.json` | L'inventari inicial: `npm run reset` el copia a `data/material.json` |
| `logs/produccio.ndjson` | El log de producció del Pas 6 |

## Fitxers que has de crear o modificar

| Pas | Fitxers |
| --- | --- |
| 1 · Diagnòstic | `respostes.md` |
| 2 · stdout, stderr i codis de sortida | `importa.js` |
| 3 · Nivells de detall | `importa.js` |
| 4 · Logs estructurats amb pino | `logger.js` (nou) i `servidor.js` |
| 5 · Errors i dades sensibles | `logger.js` i `servidor.js` |
| 6 · Investigar una incidència | `consulta.js` (nou), `respostes.md` i `servidor.js` |
| Repte (opcional) | `servidor.js` |

## Ordres

```
npm start          # engega el servidor (Ctrl+C l'atura)
npm run dev        # el mateix, amb els logs formatats per pino-pretty
npm run trafic     # en un altre terminal: envia les peticions de prova
npm run reset      # restaura data/material.json
npm run lint       # ESLint, com a la sessió 4
```

`trafic.js` fa préstecs: per repetir-lo, atura el servidor, executa `npm run reset` i torna'l a engegar.

## Normes

- Tot a mà: pots consultar nodejs.org/docs i getpino.io, però **sense IA**.
- Cap script ha de petar sense arguments: sempre un missatge d'ús.
- Un commit per pas (`Activitat 5 · Pas N`) i `git push`.
- `data/material.json` i `importats.json` queden fora de Git (són al `.gitignore` de la carpeta).

## Lliurament

Al mateix repositori de GitHub de les activitats anteriors, amb un commit per pas i `git push`. Envia la URL del repositori com a resposta a la tasca.
