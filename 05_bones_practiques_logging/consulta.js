const fs = require("node:fs");

// NDJSON: cada línia és un objecte JSON
const linies = fs.readFileSync("logs/produccio.ndjson", "utf8")
  .trim()
  .split("\n")
  .map((text) => JSON.parse(text));

const peticions = linies.filter((l) => l.msg === "petició atesa");
console.log(`${linies.length} línies, ${peticions.length} peticions`);

// Línies per nivell
const perNivell = Object.groupBy(linies, (l) => l.level);
for (const [nivell, llista] of Object.entries(perNivell)) {
  console.log(`  ${nivell}: ${llista.length}`);
}

// 1. Peticions per estat
console.log("1. Peticions per estat");
const perEstat = Object.groupBy(peticions, (p) => p.estat);
for (const [estat, llista] of Object.entries(perEstat)) {
  console.log(`  Codi d'estat ${estat}: ${llista.length}`);
}

// 2. Línies amb reqId 3c9e1b2a (també es pot mirar amb grep/Select-String a la terminal)
const idIncidencia = "3c9e1b2a";
console.log(`2. Linies amb reqId ${idIncidencia}`);
const liniesIncidencia = linies.filter((l) => l.reqId?.startsWith(idIncidencia));
liniesIncidencia.forEach((l) => console.log(l));

// 3. Peticions d'errors 500 i temps
console.log("3. Peticions d'errors 500 i temps");
perEstat["500"].forEach((p, i) => {
  console.log(`Petició 500 número ${i.toString().padStart(3, "0")} - Temps: ${p.time}`);
  console.log(p);
});

// 4. Petició més lenta
const mesLenta = peticions.reduce((mesLenta, p) => (p.ms > mesLenta.ms ? p : mesLenta));
console.log(`4. Petició més lenta:\n  ${JSON.stringify(mesLenta)}\n  Temps trigat: ${mesLenta.ms} ms`);

// 5. Temps de peticions amb errors 401
console.log("5. Temps de peticions amb errors 401");
perEstat["401"].forEach((p, i) => {
  console.log(`Petició 401 número ${i.toString().padStart(3, "0")} - Temps: ${p.time}`);
});
