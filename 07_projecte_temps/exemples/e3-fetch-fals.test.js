// Model 3 · Provar una funció que fa fetch, sense xarxa
// Executa'l: node --test exemples/
import test from "node:test";
import assert from "node:assert/strict";

// La funció rep fetch com a paràmetre. Si no l'hi passen, fa servir el de veritat
async function nomDelGos(id, fetchFn = fetch) {
  const resposta = await fetchFn(`https://exemple.cat/gossos/${id}`);
  if (!resposta.ok) {
    const err = new Error(`No hi ha cap gos amb l'id ${id}`);
    err.status = 404;
    throw err;
  }
  const dades = await resposta.json();
  return dades.nom.toUpperCase();
}

// Un fetch fals: retorna un objecte amb la mateixa forma que una resposta de veritat
const trobat = async () => ({ ok: true, status: 200, json: async () => ({ nom: "Nuc" }) });
const noTrobat = async () => ({ ok: false, status: 404, json: async () => ({}) });

test("nomDelGos retorna el nom en majúscules", async () => {
  assert.equal(await nomDelGos(1, trobat), "NUC");
});

// Amb funcions async: assert.rejects (i await), no assert.throws
test("nomDelGos rebutja un id que no existeix (404)", async () => {
  await assert.rejects(() => nomDelGos(99, noTrobat), { status: 404 });
});
