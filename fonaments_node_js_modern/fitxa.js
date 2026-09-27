const fs = require("fs");
const path = require("path");

const dades = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "material.json")));

const format = new Intl.NumberFormat("ca-ES", {
  style: "currency",
  currency: "EUR",
});
const eur = (valor) => format.format(valor); 

function fitxa( {nom, valor, estat = "disponible", ...resta} ) {
    const linia1 = `${nom} - ${eur(valor)} - ${estat}`;
    const linia2 = `  Altres camps: ${Object.keys(resta).join(", ") || "cap"}`;
    return `${linia1}\n${linia2}`;
}

const elem = dades[0];
console.log(fitxa(elem));
console.log(fitxa({ nom: "Ratolí sense fil", valor: 8 }));

const copia = {...elem, valor: `${(1 - 0.20) * elem.valor}`}
console.log(`Original: ${eur(elem.valor)} · Amortitzat: ${eur(copia.valor)}`);
