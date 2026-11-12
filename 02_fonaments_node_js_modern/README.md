# Activitat 2 · JavaScript modern

Inventari i préstecs de material de l'aula. Bloc 1 · Sense IA.

## Posada en marxa

1. Descomprimeix aquest fitxer a l'arrel del teu repositori del curs (`node-curs/`), al costat de `sessio1/` i `fonaments-node/`. Es crearà la carpeta `fonaments-node-js-modern/`.
2. Comprova que tens aquesta estructura:

```
node-curs/                     ← el teu repositori (Activitat 1)
├── .gitignore
├── sessio1/
├── fonaments-node/            ← Activitat 1
└── fonaments-node-js-modern/  ← Activitat 2
    ├── README.md
    ├── package.json
    ├── antic.js
    ├── punt-control-3.md
    └── data/
        ├── material.json
        └── material.original.json
```

3. Obre la carpeta a VS Code i, al terminal integrat, desa el punt de partida. **No facis `git init`**: el repositori ja existeix des de l'Activitat 1.

```
git add .
git commit -m "Activitat 2 · Punt de partida"
git push
```

4. Executa-ho tot des de l'arrel de `fonaments-node-js-modern/`:

```
node antic.js
```

## Les dades

`data/material.json` és un array amb 12 elements de l'inventari. Cada element té:

| Camp | Descripció |
|---|---|
| `id` | Identificador únic (UUID) |
| `codi` | Codi d'inventari (`INV-2026-0001`) |
| `nom` | Nom de l'element |
| `tipus` | `portatil`, `tauleta`, `projector`, `cable` o `altres` |
| `aula` | On es guarda |
| `valor` | Valor en euros (compte: n'hi ha un que val 0) |
| `estat` | `disponible`, `prestat` o `avariat` |
| `prestatA` | A qui s'ha prestat (només si està prestat) |
| `dataPrestec` | Quan s'ha prestat (només si està prestat) |
| `dataAlta` | Quan es va donar d'alta |

Si modifiques `material.json` i vols tornar a començar, restaura'l (també funciona a PowerShell):

```
cp data/material.original.json data/material.json
```

## Exercicis

Tots els fitxers es creen a l'arrel de `fonaments-node-js-modern/`. Un commit per pas, i `git push` després de cada commit.

| Pas | Fitxers que has de crear |
|---|---|
| 0 · Repte diagnòstic | `modern.js` |
| 1 · const, let, arrow functions i template literals | `valors.js` |
| 2 · Destructuring, rest i spread | `fitxa.js` |
| 3 · `?.` i `??` | `punt-control-3.md` (omplert), `disponibilitat.js` |
| 4 · Mètodes d'array | `filtres.js`, `cerca.js`, `estadistiques.js` |
| 5 · JSON i fitxers | `alta.js`, `prestec.js`, `retorn.js` |
| 6 · Mòduls | `material.js` (opcional: `material.mjs`, `prova-esm.mjs`) |
| Repte final (opcional) | `inventari.js`, `material.test.js` |
| Ampliació | carpeta `ampliacio/` |

El recorregut mínim és del Pas 0 al Pas 6. El que està marcat com a opcional es valora com a extra.

El `package.json` ja té l'script de tests: `npm test` executa tots els fitxers `*.test.js`.

## Avaluació

Es valoren aquests aspectes (els detalls són a l'última diapositiva de l'activitat):

- Funcionament dels scripts del Pas 0 al Pas 6
- Ús del JavaScript modern
- Validacions i errors
- El mòdul `material.js`
- Git i lliurament
- Extra (opcional): repte `inventari.js`, tests i exercicis d'ampliació

## Lliurament

1. Lliures al **mateix repositori de GitHub de l'Activitat 1**: no n'has de crear cap de nou ni tornar a fer `git remote add`. Ja està compartit amb `jpala4-ieti`.
2. Després de cada commit, puja'l:

```
git push
```

3. Abans de l'últim push, restaura `material.json` i comprova `git log --oneline`.
4. A GitHub, `fonaments-node-js-modern/` ha d'aparèixer al costat de `sessio1/` i `fonaments-node/`.
5. Envia la **URL del repositori** com a resposta a la tasca.

Si `git push` diu que no hi ha cap remot, comprova amb `git remote -v` que hi surt l'origin de l'Activitat 1. Si no hi surt, has descomprimit el zip fora del repositori.

## Normes

- Tot a mà: pots consultar nodejs.org/docs i developer.mozilla.org, però **sense IA**.
- Cap script ha de petar sense arguments: sempre un missatge d'ús.
- Abans de l'últim push, restaura `material.json`.