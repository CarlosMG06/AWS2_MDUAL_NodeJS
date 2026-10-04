const test = require("node:test");
const assert = require("node:assert");
const m = require("./material");

const dades = [
  {id: "1jwr90qtc8", nom: "Chromebook", tipus: "portatil", aula: "A105", valor: 500, estat: "disponible"},
  {id: "2giuz5gk4h", nom: "Cable USB-A a USB-C", tipus: "cable", aula: "A107", valor: 10, estat: "prestat", prestatA: "Sara"},
  {id: "3olxyns6xy", nom: "Teclat Logitech K270", tipus: "altres", aula: "A105", valor: 30, estat: "avariat"},
];


// filtres
test("filtrar per un camp", () => {
  assert.strictEqual(
    m.filtrar(dades, {tipus: "portatil"})[0].nom, 
    "Chromebook"
  );
});

test("filtrar per dos camps", () => {
  assert.strictEqual(
    m.filtrar(dades, {aula: "A105", estat: "avariat"})[0].tipus, 
    "altres"
  );
});

test("filtre desconegut llança error", () => {
  assert.throws(
    () => m.filtrar(dades, {color: "negre"}), 
    /Filtre desconegut/
  );
});

// validació d'alta
test("crear posa l'estat disponible", () => {
  const nou = m.crear("Cable", "cable", "A12", 12);
  assert.strictEqual(nou.estat, "disponible");
});

test("crear genera una id", () => {
   const nou = m.crear("Projector", "projector", "A12", 200);
   assert.ok(nou.id);
});
 
test("crear rebutja un tipus desconegut", () => {
  assert.throws(
    () => m.crear("Ratolí Logitech M185", "ratoli", "A14", 20),
    /Tipus no vàlid/
  );
});

// regles de préstec
test("prestar crea una còpia nova de les dades", () => {
  const dadesNoves = m.prestar(dades, "1jwr", "Joel");
  assert.strictEqual(dadesNoves[0].prestatA, "Joel");
  assert.strictEqual(dades[0].estat, "disponible");
});

test("retornar elimina els camps de préstec", () => {
  const dadesNoves = m.retornar(dades, "2giu");
  assert.strictEqual(dadesNoves[1].estat, "disponible");
  assert.strictEqual(dadesNoves[1].prestatA, undefined);
});

test("prestar no disponible llança error", () => {
  assert.throws(() => {
    m.prestar(dades, "3olx", "Joel"),
    /avariat/
  })
});


