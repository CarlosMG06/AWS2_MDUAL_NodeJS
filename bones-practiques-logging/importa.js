// importa.js · Afegeix a l'inventari el material d'un CSV de compra
// Ús: node importa.js data/compra-octubre.csv [-q|-v|--quiet|--verbose]
const fs = require("node:fs");
const material = require("./material");

const missatgeUs = () => {
  console.error("Ús: node importa.js <fitxer.csv> [-q|-v|--quiet|--verbose]");
  process.exit(2);
};

const NIVELLS = { error: 0, warn: 1, info: 2, debug: 3 };
const args = process.argv.slice(2);
if (args.length < 1 || args.length > 2) missatgeUs();

const fitxer = args[0];
const flag = args[1] ?? "";
let nivell = "info";
if (flag === "--quiet" || flag === "-q") nivell = "error";
else if (flag === "--verbose" || flag === "-v") nivell = "debug";
else if (flag) {
  console.error(`Opció desconeguda: ${flag}`);
  missatgeUs();
}

const log = {};
for (const [nom, valor] of Object.entries(NIVELLS)) {
  log[nom] = (missatge) => {
    if (valor <= NIVELLS[nivell]) console.error(missatge);
  };
}

function parseCSV(text) {
  const files = [];
  let fila = [];
  let camp = "";
  let entreCometes = false;
  let tancat = false;

  for (let i = 0; i < text.length; i++) {
    const caracter = text[i];
    if (entreCometes) {
      if (caracter === "\"") {
        if (text[i + 1] === "\"") {
          camp += "\"";
          i++;
        } else {
          entreCometes = false;
          tancat = true;
        }
      } else {
        camp += caracter;
      }
    } else if (caracter === ";") {
      fila.push(camp);
      camp = "";
      tancat = false;
    } else if (caracter === "\n" || caracter === "\r") {
      if (caracter === "\r" && text[i + 1] === "\n") i++;
      fila.push(camp);
      files.push(fila);
      fila = [];
      camp = "";
      tancat = false;
    } else if (caracter === "\"") {
      if (camp !== "" || tancat) throw new Error(`Cometa inesperada a la posició ${i + 1}`);
      entreCometes = true;
    } else if (tancat) {
      if (caracter !== " " && caracter !== "\t") {
        throw new Error(`Caràcter inesperat després d'un camp entre cometes a la posició ${i + 1}`);
      }
    } else {
      camp += caracter;
    }
  }

  if (entreCometes) throw new Error("Camp CSV sense tancar les cometes");
  if (camp !== "" || fila.length || tancat) {
    fila.push(camp);
    files.push(fila);
  }
  return files;
}

let text;
try {
  log.debug(`Llegint ${fitxer}`);
  text = fs.readFileSync(fitxer, "utf8");
} catch (err) {
  log.error(`No es pot llegir ${fitxer}: ${err.message}`);
  process.exit(1);
}

try {
  const files = parseCSV(text.replace(/^\uFEFF/, ""));
  const capcalera = files.shift();
  if (!capcalera || capcalera.join(";") !== "nom;tipus;aula;valor") {
    throw new Error("La capçalera ha de ser nom;tipus;aula;valor");
  }
  const inventari = material.llegir();
  const importats = [];
  const filesDades = files.filter((fila) => !(fila.length === 1 && fila[0].trim() === ""));

  filesDades.forEach((fila, i) => {
    try {
      if (fila.length !== 4) throw new Error("Calen exactament quatre camps");
      const [nom, tipus, aula, valor] = fila;
      const nou = material.crear({ nom, tipus, aula, valor });
      inventari.push(nou);
      importats.push(nou);
      log.debug(`Fila ${i + 2} importada: ${nou.nom} (${nou.id.slice(0, 8)})`);
    } catch (err) {
      log.warn(`Fila ${i + 2} rebutjada: ${err.message}`);
      process.exitCode = 1;
    }
  });
  const rebutjatsNum = filesDades.length - importats.length;

  material.desar(inventari);
  log.info(`Importació: ${importats.length} importats i ${rebutjatsNum} rebutjats de ${filesDades.length} files`);

  console.log(JSON.stringify(importats, null, 2));
} catch (err) {
  log.error(`Error d'importació: ${err.message}`);
  process.exit(1);
}
