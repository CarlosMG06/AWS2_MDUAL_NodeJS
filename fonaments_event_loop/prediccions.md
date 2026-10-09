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
