const test = require("node:test");
const assert = require("node:assert");
const { crear } = require("./material");
 
test("crear posa l'estat disponible", () => {
  const nou = crear({ nom: "Cable", tipus: "cable", aula: "A12", valor: 12 });
  assert.strictEqual(nou.estat, "disponible");
});
 
test("crear rebutja un tipus desconegut", () => {
  assert.throws(
    () => crear({ nom: "X", tipus: "nevera", aula: "A12", valor: 1 }),
    /Tipus no vàlid/
  );
});
