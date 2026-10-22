// importa.js · Afegeix a l'inventari el material d'un CSV de compra
// Ús: node importa.js data/compra-octubre.csv
const fs = require("node:fs");
const material = require("./material");

const fitxer = process.argv[2];
console.log("Iniciant importació...");

try {
  const text = fs.readFileSync(fitxer, "utf8");
  // La primera línia és la capçalera: nom;tipus;aula;valor
  const files = text.trim().split("\n").slice(1);
  const inventari = material.llegir();
  const importats = [];

  for (const fila of files) {
    const [nom, tipus, aula, valor] = fila.split(";");
    try {
      const nou = material.crear({ nom, tipus, aula, valor });
      inventari.push(nou);
      importats.push(nou);
      console.log("Importat " + nom);
    } catch {
      console.log("Error en una fila");
    }
  }

  material.desar(inventari);
  console.log("Fet!");
  console.log(JSON.stringify(importats, null, 2));
} catch (err) {
  console.log("Error: " + err);
}
