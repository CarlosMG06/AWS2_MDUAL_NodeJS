const fs = require("fs");
const path = require("path");

const dades = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "material.json")));

const format = new Intl.NumberFormat("ca-ES", {
  style: "currency",
  currency: "EUR",
});
const eur = (valor) => format.format(valor);

const iniciId = process.argv[2];
if (!iniciId) {
    console.log("Ús: node cerca.js <inici_id>");
    process.exit(1);
}

const elementId = dades.find(elem => elem.id.startsWith(iniciId));

if (!elementId) {
    console.log(`No s'ha trobat cap element amb id que comenci amb ${iniciId}`);
    process.exit(1);
}

const {nom, tipus, aula, estat, prestatA} = elementId;
console.log(nom);
console.log(`  ${tipus} · ${aula} · ${estat} ${prestatA ? `(${prestatA})` : ""}`);
