# Prediccions de codi

### Codi diagnostic.js

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

Les lletres sortiran en l'ordre: **A G D C B E F**
1. **A G**: codi síncron
2. **D**: nextTick
3. **C**: promesa
4. **B E**: Timeout
5. **F**: promesa dins de Timeout