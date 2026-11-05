const fs = require("node:fs");

const args = process.argv.slice(2);
if (args.length > 1) {
  console.error("Ús: node consulta.js [fitxer.ndjson]");
  process.exit(2);
}

const fitxer = args[0] ?? "logs/produccio.ndjson";
let text;
try {
  text = fs.readFileSync(fitxer, "utf8");
} catch (err) {
  console.error(`No es pot llegir ${fitxer}: ${err.message}`);
  process.exit(1);
}

const linies = [];
for (const [i, linia] of text.split(/\r?\n/).entries()) {
  if (!linia.trim()) continue;
  try {
    const dada = JSON.parse(linia);
    if (!dada || typeof dada !== "object" || Array.isArray(dada)) throw new Error("La línia no és un objecte");
    linies.push(dada);
  } catch (err) {
    console.error(`Línia ${i + 1} ignorada: ${err.message}`);
  }
}

const peticions = linies.filter((l) => l.msg === "petició atesa");
console.log(`${linies.length} línies, ${peticions.length} peticions`);

const perNivell = Object.groupBy(linies, (l) => l.level ?? "desconegut");
for (const [nivell, llista] of Object.entries(perNivell)) {
  console.log(`  ${nivell}: ${llista.length}`);
}

const perEstat = Object.groupBy(peticions, (p) => p.estat ?? "desconegut");
console.log("1. Peticions per estat");
for (const [estat, llista] of Object.entries(perEstat)) {
  console.log(`  Codi d'estat ${estat}: ${llista.length}`);
}

const idIncidencia = "3c9e1b2a";
console.log(`2. Linies amb reqId ${idIncidencia}`);
const liniesIncidencia = linies.filter((l) => typeof l.reqId === "string" && l.reqId.startsWith(idIncidencia));
liniesIncidencia.forEach((l) => console.log(l));

console.log("3. Peticions d'errors 500 i temps");
const errors500 = perEstat["500"] ?? [];
errors500.forEach((p, i) => {
  console.log(`Petició 500 número ${i.toString().padStart(3, "0")} - Temps: ${p.ms ?? p.time ?? "desconegut"}`);
  console.log(p);
});

console.log("4. Petició més lenta");
const ambTemps = peticions.filter((p) => Number.isFinite(p.ms));
if (ambTemps.length) {
  const mesLenta = ambTemps.reduce((anterior, actual) => (actual.ms > anterior.ms ? actual : anterior));
  console.log(`  ${JSON.stringify(mesLenta)}\n  Temps trigat: ${mesLenta.ms} ms`);
} else {
  console.log("  No hi ha peticions amb temps disponible");
}

console.log("5. Temps de peticions amb errors 401");
const errors401 = perEstat["401"] ?? [];
errors401.forEach((p, i) => {
  console.log(`Petició 401 número ${i.toString().padStart(3, "0")} - Temps: ${p.ms ?? p.time ?? "desconegut"}`);
});
