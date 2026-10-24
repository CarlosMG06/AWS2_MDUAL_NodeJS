// importa.js · Afegeix a l'inventari el material d'un CSV de compra
// Ús: node importa.js data/compra-octubre.csv
const fs = require("node:fs");
const material = require("./material");

const missatgeUs = () => {
  console.error("Ús: node importa.js <fitxer.json> [-q|-v|--quiet|--verbose]");
  process.exit(2);
};

const NIVELLS = { error: 0, warn: 1, info: 2, debug: 3 };
const args = process.argv.slice(2);
const flag = args[1] ?? "";
let nivell = "info";
if (flag === "--quiet" || flag === "-q") nivell = "error";
else if (flag === "--verbose" || flag === "-v") nivell = "debug";
else if (flag.includes("--")) missatgeUs();
// Cada funció escriu a stderr si arriba al nivell triat
const log = {};
for (const [nom, valor] of Object.entries(NIVELLS)) {
  log[nom] = (missatge) => {
    if (valor <= NIVELLS[nivell]) console.error(missatge);
  };
}

const fitxer = args[0];
if (!fitxer) missatgeUs();

let text;
try {
  log.debug(`Llegint ${fitxer}`);
  text = fs.readFileSync(fitxer, "utf8");
} catch (err) {
  log.error(`No es pot llegir ${fitxer}: ${err.message}`);
  process.exit(1);
}

try {
  // La primera línia és la capçalera: nom;tipus;aula;valor
  const files = text.trim().split("\n").slice(1);
  const inventari = material.llegir();
  const importats = [];

  files.forEach((fila, i) => {
    const [nom, tipus, aula, valor] = fila.split(";");
    try {
      const nou = material.crear({ nom, tipus, aula, valor });
      inventari.push(nou);
      importats.push(nou);
      log.debug(`Fila ${i + 2} importada: ${nou.nom} (${nou.id.slice(0, 8)})`);
    } catch (err) {
      log.warn(`Fila ${i + 2} rebutjada: ${err.message}`);
    }
  });
  const rebutjatsNum = files.length - importats.length;

  material.desar(inventari);
  log.info(`Importació: ${importats.length} importats i ${rebutjatsNum} rebutjats de ${files.length} files`);

  console.log(JSON.stringify(importats, null, 2));
} catch (err) {
  log.error(`Error desconegut: ${err}`);
  process.exit(1);
}

process.exitCode = 1;
