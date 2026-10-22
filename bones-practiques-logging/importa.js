// importa.js · Afegeix a l'inventari el material d'un CSV de compra
// Ús: node importa.js data/compra-octubre.csv
const fs = require("node:fs");
const material = require("./material");

const fitxer = process.argv[2];
if (!fitxer) {
  console.error("Ús: node exemples/p2-sortides.js <fitxer.json>");
  process.exit(2);
}

let text;
try {
  text = fs.readFileSync(fitxer, "utf8");
} catch (err) {
  console.error(`No es pot llegir ${fitxer}: ${err.message}`);
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
    } catch (err) {
      console.error(`Fila ${i+2} rebutjada: ${err.message}`);
    }
  });
  const rebutjatsNum = files.length - importats.length;

  material.desar(inventari);
  console.error(`Importació: ${importats.length} importats i ${rebutjatsNum} rebutjats de ${files.length} files`);
  console.log(JSON.stringify(importats, null, 2));
} catch (err) {
  console.error(`Error desconegut: ${err}`);
  process.exit(1);
}
