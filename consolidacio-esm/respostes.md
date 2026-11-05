# Respostes · Activitat 6

## Pas 1 · De CommonJS a ES Modules

Fes cada experiment, copia la primera línia de l'error i explica'l amb les teves paraules.

1. A `prova-material.js`, treu l'extensió de l'import (`"./material"`) i executa `node prova-material.js`.
   - Error:
   - Per què:
2. A `material.js`, canvia `import.meta.dirname` per `__dirname`.
   - Error:
   - Per què:
3. Crea `prova-require.js` amb la línia `const fs = require("node:fs");` i executa'l.
   - Error:
   - Per què:
   - Què diu Node que podries fer:

## Per pensar

- Quina línia del `package.json` fa que els `.js` d'aquesta carpeta siguin ES Modules?
- Per què `material.cjs` funciona encara que el `package.json` digui `"type": "module"`?
- Per què `eslint.config.mjs` ja era ES Modules a les activitats anteriors?
