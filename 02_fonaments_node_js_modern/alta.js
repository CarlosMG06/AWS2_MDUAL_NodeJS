const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PATH = path.join(__dirname, "data", "material.json");
const arrTipus = ["portatil", "tauleta", "projector", "cable", "altres"];
const format = new Intl.NumberFormat("ca-ES", {
  style: "currency",
  currency: "EUR",
});
const eur = (valor) => format.format(valor); 

const [nom, tipus, aula, valorStr] = process.argv.slice(2);

if (!nom || !tipus || !aula || !valorStr) {
    console.log("Ús: node alta.js <nom> <tipus> <aula> <valor>");
    process.exit(1);
}
if (!arrTipus.includes(tipus)) {
    console.log(`Tipus no vàlid: ${tipus}`);
    console.log(`Vàlids: ${arrTipus.join(", ")}`);
    process.exit(1);
}
if (!parseInt(valorStr) || valorStr < 0) {
    console.log(`Valor no vàlid: ${valorStr}`);
    process.exit(1);
}
const valor = parseInt(valorStr);

const dades = JSON.parse(fs.readFileSync(PATH));
const nou = {
    id: crypto.randomUUID(),
    nom, tipus, aula, valor,
    estat: "disponible",
    dataAlta: new Date().toISOString(),
};

fs.writeFileSync(PATH, JSON.stringify([...dades, nou], null, 2));
console.log(`Alta feta: [${nou.id.slice(0,8)}] ${nom} · ${aula} · ${eur(valor)}`);