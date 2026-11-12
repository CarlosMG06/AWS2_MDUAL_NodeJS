import test from "node:test";
import assert from "node:assert/strict";

import { cercar, filtrar, prestar, retornar } from "./material.js";

const inventari = [
  { codi: "M001", nom: "Projector", estat: "disponible" },
  { codi: "M002", nom: "Portàtil", estat: "prestat", prestatA: "Laia" },
  { codi: "M003", nom: "Pantalla", estat: "avariat" },
];

test("filtrar per un estat vàlid", () => {
  assert.deepEqual(filtrar(inventari, "disponible"), [inventari[0]]);
});

test("filtrar per un estat no vàlid llença error 400", () => {
  assert.throws(
    () => filtrar(inventari, "perdut"),
    { status: 400 },
  );
});

test("cercar un codi existent", () => {
  assert.deepEqual(cercar(inventari, "M002"), inventari[1]);
});

test("cercar un codi inexistent llença error 404", () => {
  assert.throws(
    () => cercar(inventari, "M999"),
    { status: 404 },
  );
});

test("prestar un material disponible", () => {
  const copia = inventari.map((m) => m);
  const nou = prestar(inventari, "M001", "Joana");
  const prestat = nou.find((material) => material.codi === "M001");

  assert.equal(prestat.estat, "prestat");
  assert.equal(prestat.prestatA, "Joana");
  assert.equal(new Date(prestat.dataPrestec).toISOString(), prestat.dataPrestec);
  // Les dades originals no es modifiquen
  assert.deepEqual(inventari, copia);
});

test("prestar un material no disponible llença error 409", () => {
  assert.throws(
    () => prestar(inventari, "M002", "Joana"),
    { status: 409 },
  );
});

test("prestar un material inexistent llença error 404", () => {
  assert.throws(
    () => prestar(inventari, "M999", "Joana"),
    { status: 404 },
  );
});

test("prestar amb el nom buit llença error 400", () => {
  assert.throws(
    () => prestar(inventari, "M001", "  "),
    { status: 400 },
  );
});

test("retornar un material prestat", () => {
  const copia = inventari.map((m) => m);
  const nou = retornar(inventari, "M002");
  const prestat = nou.find((material) => material.codi === "M002");

  assert.equal(prestat.estat, "disponible");
  assert.equal(prestat.prestatA, undefined);
  assert.equal(prestat.dataPrestec, undefined);
  // Les dades originals no es modifiquen
  assert.deepEqual(inventari, copia);
});

test("retornar un material no prestat llença error 409", () => {
  assert.throws(
    () => retornar(inventari, "M003"),
    { status: 409 },
  );
});

test("retornar un material inexistent llença error 404", () => {
  assert.throws(
    () => retornar(inventari, "M999"),
    { status: 404 },
  );
});
