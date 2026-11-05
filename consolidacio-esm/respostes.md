# Respostes · Activitat 6

## Pas 1 · De CommonJS a ES Modules

Fes cada experiment, copia la primera línia de l'error i explica'l amb les teves paraules.

1. A `prova-material.js`, treu l'extensió de l'import (`"./material"`) i executa `node prova-material.js`.
   - Error:
   ```
   Error [ERR_MODULE_NOT_FOUND]: Cannot find module 
   '/.../material' imported from /.../prova-material.js
   Did you mean to import "./material.js"?
   ```
   - Per què: Hi ha dos moduls anomenats material, "material.cjs" i "material.js".
2. A `material.js`, canvia `import.meta.dirname` per `__dirname`.
   - Error:
   ```
   ReferenceError: __dirname is not defined in ES module scope
   This file is being treated as an ES module because it has a '.js' file extension and '/.../package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
   ```
   - Per què: `__dirname` és una variable de CommonJS, i el projecte utilitza ES Modules.
3. Crea `prova-require.js` amb la línia `const fs = require("node:fs");` i executa'l.
   - Error:
   ```
   ReferenceError: require is not defined in ES module scope, you can use import instead
   This file is being treated as an ES module because it has a '.js' file extension and '/.../package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
   ```
   - Per què: `require` és una funció de CommonJS, i el projecte utilitza ES Modules.
   - Què diu Node que podries fer: Diu que podria fer servir `import`, o bé canviar l'extensió a `.cjs`.

## Per pensar

- Quina línia del `package.json` fa que els `.js` d'aquesta carpeta siguin ES Modules?

Ho fa la línia 6, on diu `"type": "module"`.

- Per què `material.cjs` funciona encara que el `package.json` digui `"type": "module"`?

Per l'extensió `.cjs`, que permet l'ús de CommonJS en projectes d'ES Modules. 

- Per què `eslint.config.mjs` ja era ES Modules a les activitats anteriors?

Per l'extensió `.mjs`, que permet l'ús d'ES Modules en projectes de CommonJS.
