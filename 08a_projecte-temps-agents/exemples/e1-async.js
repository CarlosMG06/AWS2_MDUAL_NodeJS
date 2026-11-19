// Model 1 · async/await i Promise.all, sense xarxa
// Executa'l: node exemples/e1-async.js
import { setTimeout as esperar } from "node:timers/promises";

const PREUS = { teclat: 25, monitor: 140, webcam: 38 };

// Una funció async sempre retorna una promesa: qui la crida ha de fer await
async function preuDe(producte) {
  await esperar(500); // fa veure que ho pregunta a un servidor
  if (!(producte in PREUS)) {
    throw new Error(`No tenim: ${producte}`);
  }
  return { producte, preu: PREUS[producte] };
}

// 1 · En sèrie: cada await espera l'anterior (1500 ms)
console.time("en sèrie");
const a = await preuDe("teclat");
const b = await preuDe("monitor");
const c = await preuDe("webcam");
console.timeEnd("en sèrie");
console.log([a, b, c]);

// 2 · Alhora: Promise.all espera que acabin totes (500 ms)
console.time("alhora");
const productes = ["teclat", "monitor", "webcam"];
const resultats = await Promise.all(
  productes.map((p) => preuDe(p)),
);
console.timeEnd("alhora");
console.log(resultats); // en el mateix ordre que l'array de productes

// 3 · Si una promesa falla, Promise.all falla: es recull amb try/catch
try {
  await Promise.all([preuDe("teclat"), preuDe("cadira")]);
} catch (err) {
  console.error(`Ha fallat: ${err.message}`);
}
