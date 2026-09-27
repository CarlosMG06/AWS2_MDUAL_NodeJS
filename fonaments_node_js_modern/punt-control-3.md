# Punt de control 3 · Endevina el resultat

Escriu què mostra cada línia **sense executar res**. Després comprova-ho amb Node.

```js
const m = { nom: "HP 14", valor: 0 };
```

1. console.log(0 ?? 5);                                   → Mostra: ____0____  Encertat: __Sí_
2. console.log(0 || 5);                                   → Mostra: ____5____  Encertat: __Sí_
3. console.log("" ?? "buit");                             → Mostra: ____""____  Encertat: __Sí_
4. console.log("" || "buit");                             → Mostra: ____"buit"____  Encertat: __Sí_
5. console.log(m.valor || "sense valor");                 → Mostra: ____"sense valor"____  Encertat: __Sí_
6. console.log(m.valor ?? "sense valor");                 → Mostra: ____0____  Encertat: __Sí_
7. console.log(m.prestatA?.toUpperCase());                → Mostra: ____undefined____  Encertat: __Sí_
8. console.log(m.prestatA?.toUpperCase() ?? "a l'aula");  → Mostra: ____"a l'aula"____  Encertat: __Sí_

## Per pensar

- Quina diferència hi ha entre `??` i `||`? En quins casos donen resultats diferents?
R: Donen casos diferents quan el valor de l'esquerra és falsy però no és null ni undefined.
- Què passaria a la línia 7 sense el `?.`?
R: Llençaria un TypeError.
- A l'inventari, la tauleta donada val `0`. Quin operador faries servir per mostrar-ne el valor? Per què?
R: Faria servir ?? per mostrar-ne el valor encara que sigui 0 (falsy).
