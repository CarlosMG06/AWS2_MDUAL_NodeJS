# Activitat 6 · Consolidació: una API, un client i logs

Repàs de tot el que hem vist fins ara en un sol projecte, però aquest cop en **ES Modules**:

- `material.js`: la lògica de l'inventari, convertida de CommonJS a ES Modules (Pas 1).
- `servidor.js`: una API de l'inventari amb `node:http` (Pas 2) i logs amb pino (Pas 3).
- `client.js`: un client de terminal que fa servir l'API amb `fetch` (Pas 4).
- `material.test.js`: els tests més importants, triats després de demanar una proposta a la IA (Pas 5).

## Posada en marxa

1. Copia la carpeta `consolidacio-esm/` a l'arrel del teu repositori del curs (`node-curs/`), al costat de les activitats anteriors. **No facis `git init`**: el repositori ja existeix.
2. Des de `consolidacio-esm/`, instal·la les dependències, crea `data/material.json` i comprova el linter:

```
npm install
npm run reset
npm run lint
```

3. Desa el punt de partida:

```
git add .
git commit -m "Activitat 6 · Punt de partida"
git push
```

## Què hi ha

| Fitxer | Què és |
| --- | --- |
| `material.cjs` | La lògica de l'inventari en CommonJS. No es toca: és el punt de partida del Pas 1 |
| `prova-material.js` | Comprova el Pas 1. Ve fet |
| `prova-api.js` | Envia deu peticions a l'API i en mostra l'estat. Ve fet |
| `exemples/` | Un model executable per a cada pas, sobre una llista d'aules |
| `respostes.md` | Les preguntes del Pas 1 |
| `IA.md` | El registre d'ús de la IA del Pas 5 |
| `data/material.original.json` | L'inventari inicial: `npm run reset` el copia a `data/material.json` |

## Fitxers que has de crear o modificar

| Pas | Fitxers |
| --- | --- |
| 1 · De CommonJS a ES Modules | `material.js` (nou) i `respostes.md` |
| 2 · Una API amb node:http | `servidor.js` (nou) |
| 3 · Logs amb pino | `logger.js` (nou) i `servidor.js` |
| 4 · Un client amb fetch | `client.js` (nou) |
| 5 · La IA proposa els tests | `IA.md` i `material.test.js` (nou) |
| Repte (opcional) | `material.js`, `servidor.js` i `client.js` |

## Ordres

```
npm start          # engega l'API (Ctrl+C l'atura)
npm run dev        # el mateix, amb els logs formatats per pino-pretty
npm run prova-api  # en un altre terminal: deu peticions de prova
npm run reset      # restaura data/material.json
npm run lint       # ESLint
npm test           # node --test: executa els fitxers *.test.js
```

Els préstecs modifiquen l'inventari: per repetir les proves, atura el servidor, executa `npm run reset` i torna'l a engegar.

## Normes

- Els passos 1 a 4 es fan a mà, **sense IA**. Pots consultar nodejs.org/docs, developer.mozilla.org i getpino.io.
- La IA només es fa servir al Pas 5, amb un xatbot al navegador, i tot el que proposi es registra a `IA.md`.
- Als xats no s'enganxen mai claus, contrasenyes ni dades personals. `material.json` és fictici.
- Cap script ha de petar sense arguments: sempre un missatge d'ús.
- Un commit per pas (`Activitat 6 · Pas N`) i `git push`.

## Lliurament

Al mateix repositori de GitHub de les activitats anteriors, amb un commit per pas i `git push`. Envia la URL del repositori com a resposta a la tasca.
