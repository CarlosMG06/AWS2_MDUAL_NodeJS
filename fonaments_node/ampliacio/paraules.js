const fs = require("node:fs");
const path = require("node:path");

const rutaFitxer = process.argv[2];
if (!rutaFitxer) {
    console.log("Ús: node ampliacio/paraules.js <ruta_fitxer>");
    process.exit(1);
}

const PATH = path.join(__dirname, "text.txt");
const text = fs.readFileSync(PATH, "utf8");

const linies = text.split("\n")
    .filter(linia => linia.trim() !== ""); 
const paraules = text.split(/\s+/)
    .filter(paraula => paraula.trim() !== "");

console.log(`Línies:    ${linies.length}`);
console.log(`Paraules:  ${paraules.length}`);
console.log(`Caràcters: ${text.length}`);

// Extra:
const mesLlarga = paraules.reduce((max, paraula) => (paraula.length > max.length) ? paraula : max);
console.log(`Paraula més llarga: ${mesLlarga}`); 