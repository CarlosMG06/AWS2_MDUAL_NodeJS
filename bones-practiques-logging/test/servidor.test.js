const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { crearServidor } = require("../servidor");

const inventariOriginal = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/material.original.json"), "utf8"));
const token = "test-token";

async function preparaServidor(opcions = {}) {
  const servidor = crearServidor({
    token,
    inventari: structuredClone(inventariOriginal),
    desarAsync: (llista, callback) => callback(null),
    ...opcions,
  });
  await new Promise((resolve) => servidor.listen(0, "127.0.0.1", resolve));
  const { port } = servidor.address();
  return {
    base: `http://127.0.0.1:${port}`,
    tanca: () => new Promise((resolve, reject) => servidor.close((err) => (err ? reject(err) : resolve()))),
  };
}

async function enviaPrestec(base, cos) {
  return fetch(`${base}/prestecs`, {
    method: "POST",
    headers: { "authorization": `Bearer ${token}`, "content-type": "application/json" },
    body: cos,
  });
}

test("respon 400 per JSON mal format", async (t) => {
  const servidor = await preparaServidor();
  t.after(servidor.tanca);

  const resposta = await enviaPrestec(servidor.base, "{");

  assert.equal(resposta.status, 400);
  assert.equal((await resposta.json()).error, "El cos ha de ser JSON vàlid");
});

test("respon 400 quan falten camps obligatoris", async (t) => {
  const servidor = await preparaServidor();
  t.after(servidor.tanca);

  const respostes = await Promise.all([
    enviaPrestec(servidor.base, JSON.stringify({})),
    enviaPrestec(servidor.base, JSON.stringify({ id: "f38b", persona: { nom: "Marta" } })),
  ]);

  assert.deepEqual(respostes.map((resposta) => resposta.status), [400, 400]);
  assert.match((await respostes[1].json()).error, /correu/);
});

test("respon 500 si no es pot desar el préstec", async (t) => {
  const servidor = await preparaServidor({
    desarAsync: (_llista, callback) => callback(new Error("fallada d'escriptura")),
  });
  t.after(servidor.tanca);

  const resposta = await enviaPrestec(servidor.base, JSON.stringify({
    id: "f38b",
    persona: { nom: "Marta", email: "marta@institut.cat" },
  }));

  assert.equal(resposta.status, 500);
  assert.equal((await resposta.json()).error, "Error intern");
});

test("serialitza préstecs concurrents del mateix element", async (t) => {
  const desats = [];
  const servidor = await preparaServidor({
    desarAsync: (llista, callback) => {
      setTimeout(() => {
        desats.push(structuredClone(llista));
        callback(null);
      }, 10);
    },
  });
  t.after(servidor.tanca);
  const cos = JSON.stringify({ id: "f38b", persona: { nom: "Marta", email: "marta@institut.cat" } });

  const respostes = await Promise.all([
    enviaPrestec(servidor.base, cos),
    enviaPrestec(servidor.base, cos),
  ]);

  assert.deepEqual(respostes.map((resposta) => resposta.status).sort(), [201, 409]);
  assert.equal(desats.length, 1);
  assert.equal(desats[0].find((element) => element.id.startsWith("f38b")).estat, "prestat");
});
