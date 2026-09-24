# Punt de control 3 · Endevina el resultat

Escriu què mostra cada línia **sense executar res**. Després comprova-ho amb Node.

```js
const m = { nom: "HP 14", valor: 0 };
```

1. console.log(0 ?? 5);                                   → Mostra: ________  Encertat: ___
2. console.log(0 || 5);                                   → Mostra: ________  Encertat: ___
3. console.log("" ?? "buit");                             → Mostra: ________  Encertat: ___
4. console.log("" || "buit");                             → Mostra: ________  Encertat: ___
5. console.log(m.valor || "sense valor");                 → Mostra: ________  Encertat: ___
6. console.log(m.valor ?? "sense valor");                 → Mostra: ________  Encertat: ___
7. console.log(m.prestatA?.toUpperCase());                → Mostra: ________  Encertat: ___
8. console.log(m.prestatA?.toUpperCase() ?? "a l'aula");  → Mostra: ________  Encertat: ___

## Per pensar

- Quina diferència hi ha entre `??` i `||`? En quins casos donen resultats diferents?
- Què passaria a la línia 7 sense el `?.`?
- A l'inventari, la tauleta donada val `0`. Quin operador faries servir per mostrar-ne el valor? Per què?
