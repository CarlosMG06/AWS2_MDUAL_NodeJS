// p2-sortides.js · Resultat a stdout, diagnòstic a stderr
// Prova: node exemples/p2-sortides.js data/material.json
const fs = require("node:fs");

const fitxer = process.argv[2];
if (!fitxer) {
  console.error("Ús: node exemples/p2-sortides.js <fitxer.json>");
  process.exit(2); // 2: ús incorrecte
}

let llista;
try {
  llista = JSON.parse(fs.readFileSync(fitxer, "utf8"));
} catch (err) {
  console.error(`No es pot llegir ${fitxer}: ${err.message}`);
  process.exit(1); // 1: error
}

const lliures = llista.filter((m) => m.estat === "disponible");
// Diagnòstic, per a la persona que mira el terminal
console.error(`Llegits ${llista.length}, ${lliures.length} lliures`);
// Resultat, per al fitxer o el programa que el rebi
console.log(JSON.stringify(lliures.map((m) => m.nom), null, 2));
