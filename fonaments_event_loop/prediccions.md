# Prediccions de codi

## Pas 0

Codi **diagnostic.js**

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
process.nextTick(() => console.log("D"));
setTimeout(() => {
  console.log("E");
  Promise.resolve().then(() => console.log("F"));
}, 0);
console.log("G");
```

Les lletres sortiran en l'ordre: "**A G D C B E F**"
1. **A G**: codi síncron
2. **D**: nextTick
3. **C**: promesa
4. **B E**: Timeout
5. **F**: promesa dins de Timeout

*Correcte*

## Pas 1
Punt de control - **Cues niades**
```js
// Cas A
process.nextTick(() => console.log("1"));
Promise.resolve().then(() => console.log("2"));
process.nextTick(() => {
  console.log("3");
  process.nextTick(() => console.log("4"));
});
 
// Cas B
setTimeout(() => console.log("1"), 0);
setTimeout(() => {
  console.log("2");
  process.nextTick(() => console.log("3"));
}, 0);
setTimeout(() => console.log("4"), 0);
Promise.resolve().then(() => setTimeout(() => console.log("5"), 0));
```

- **Cas A**: Mostrarà "**1 3 4 2**":
1. nextTick
2. nextTick(nextTick) - s'afegeix a la mateixa cua
3. Promise

*Correcte*

- **Cas B**: Mostrarà "**5 1 2 3 4**": 
1. Promise(Timeout)
2. Timeouts en ordre - nextTick es mira després de cada Timeout

*Incorrecte* - mostra "**1 2 3 4 5**", Promise afegeix el seu Timeout a la cua de temporitzadors després que ja s'hagin afegit la resta durant la passada síncrona

## Pas 2

Codi **fases.js**
```js
const fs = require("node:fs");

setTimeout(() => console.log("principal · timeout"), 0);
setImmediate(() => console.log("principal · immediate"));

fs.readFile(__filename, (err, data) => {
    setTimeout(() => console.log("E/S · timeout"), 0);
    setImmediate(() => console.log("E/S · immediate"));
});
```

Resultat esperat
```
$ node fases.js
principal · immediate
principal · timeout
E/S · immediate
E/S · timeout
$ node fases.js
principal · timeout
principal · immediate
E/S · immediate
E/S · timeout
```

**Explicació:**

Des del mòdul principal, varia quin surt primer perquè si el bucle:
- arriba a la fase timers **abans** que venci 1 ms: el timeout no acaba, immediate surt primer
- arriba a la fase timers **després** que venci 1 ms: acaba el timeout, immediate surt segon

Des d'un callback d'E/S, el bucle sempre està a la fase poll, i la següent sempre és check. Per tant, immediate sempre surt primer.

## Pas 3

Codi **casC.js**
```js
setTimeout(() => console.log("1"), 10);
setTimeout(() => console.log("2"), 0);
const inici = Date.now();
while (Date.now() - inici < 50) {}
console.log("3");
```

- Mostrarà "3 2 1". Mentre el bucle ```while``` està actiu, els dos timeouts no estan temporitzant el temps que passa.

*Correcte*

---
Resultat esperat - **bloqueig.js**
```
$ node bloqueig.js
tic 1 · 201 ms
tic 2 · 401 ms
tic 3 · 601 ms
tic 4 · 802 ms
Comença la feina pesada (2 s)...
Feina feta
tic 5 · 2902 ms
…
tic 8 · 3504 ms
Salt més gran entre tics: 2100 ms
```

- S'han perdut 20 tics. El tic 5 només surt una sola vegada perquè el bucle ```while``` de la funció ```ocupa(ms)``` fa que s'esperi l'interval.

## Pas 5

Resultat **pool.js**
```
$ node pool.js
Fils del pool: 4 (per defecte)
Totes les tasques enviades: el fil principal ja està lliure
Tasca 1 · 127 ms
Tasca 3 · 129 ms
Tasca 2 · 169 ms
Tasca 0 · 171 ms
Tasca 4 · 253 ms
Tasca 5 · 256 ms

$ UV_THREADPOOL_SIZE=2 node pool.js
Fils del pool: 2
Totes les tasques enviades: el fil principal ja està lliure
Tasca 0 · 130 ms
Tasca 1 · 146 ms
Tasca 2 · 261 ms
Tasca 3 · 269 ms
Tasca 4 · 389 ms
Tasca 5 · 392 ms

$ UV_THREADPOOL_SIZE=6 node pool.js
Fils del pool: 6
Totes les tasques enviades: el fil principal ja està lliure
Tasca 4 · 134 ms
Tasca 3 · 135 ms
Tasca 1 · 232 ms
Tasca 2 · 232 ms
Tasca 0 · 235 ms
Tasca 5 · 240 ms
```

- 4 fils: acaben en 2 grups
- 2 fils: acaben en 3 grups
- 6 fils: acaben en 1 sol grup

Extra: ```pbkdf2Sync()```
```
$ node pool.extra.js
Fils del pool: 4 (per defecte)
Tasca 0 · 125 ms
Tasca 1 · 251 ms
Tasca 2 · 371 ms
Tasca 3 · 489 ms
Tasca 4 · 609 ms
Tasca 5 · 729 ms
Totes les tasques enviades: el fil principal ja està lliure

$ UV_THREADPOOL_SIZE=2 node pool.extra.js
Fils del pool: 2
Tasca 0 · 121 ms
Tasca 1 · 240 ms
Tasca 2 · 360 ms
Tasca 3 · 480 ms
Tasca 4 · 607 ms
Tasca 5 · 727 ms
Totes les tasques enviades: el fil principal ja està lliure

$ UV_THREADPOOL_SIZE=6 node pool.extra.js
Fils del pool: 6
Tasca 0 · 123 ms
Tasca 1 · 243 ms
Tasca 2 · 366 ms
Tasca 3 · 491 ms
Tasca 4 · 614 ms
Tasca 5 · 737 ms
Totes les tasques enviades: el fil principal ja està lliure
```

- Triga gairebé el triple, independentment de la quantitat de fils, ja que la funció síncrona fa que els fils s'esperin a que acabi.