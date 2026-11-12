// p5-tests-model.js · Model del Pas 5: tests amb node:test en ES Modules
// Prova: node --test exemples/p5-tests-model.js
import test from "node:test";
import assert from "node:assert/strict";
import { ambCapacitat } from "./p1-modul.js";

// Dades pròpies: el test no depèn de cap fitxer
const aules = [
  { nom: "A", places: 10 },
  { nom: "B", places: 30 },
];

test("ambCapacitat torna només les aules amb prou places", () => {
  assert.deepEqual(ambCapacitat(aules, 20), [{ nom: "B", places: 30 }]);
});

test("ambCapacitat no modifica la llista original", () => {
  ambCapacitat(aules, 20);
  assert.equal(aules.length, 2);
});

test("ambCapacitat rebutja un mínim negatiu amb status 400", () => {
  assert.throws(() => ambCapacitat(aules, -1), { status: 400 });
});
