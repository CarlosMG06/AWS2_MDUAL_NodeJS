// p6-consulta.js · Llegir un log NDJSON i fer-hi preguntes
// Prova: node exemples/p6-consulta.js
const fs = require("node:fs");

// NDJSON: cada línia és un objecte JSON
const linies = fs.readFileSync("logs/produccio.ndjson", "utf8")
  .trim()
  .split("\n")
  .map((text) => JSON.parse(text));

const peticions = linies.filter((l) => l.msg === "petició atesa");
console.log(`${linies.length} línies, ${peticions.length} peticions`);

// Quantes línies hi ha de cada nivell?
const perNivell = Object.groupBy(linies, (l) => l.level);
for (const [nivell, llista] of Object.entries(perNivell)) {
  console.log(`  ${nivell}: ${llista.length}`);
}

// Les tres primeres peticions amb 404
peticions
  .filter((l) => l.estat === 404)
  .slice(0, 3)
  .forEach((l) => console.log(l.time, l.reqId.slice(0, 8), l.ruta));
