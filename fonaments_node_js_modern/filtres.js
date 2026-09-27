const fs = require("fs");
const path = require("path");

const dades = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "material.json")));
const format = new Intl.NumberFormat("ca-ES", {
  style: "currency",
  currency: "EUR",
});
const eur = (valor) => format.format(valor); 
const tLC = str => str?.toLowerCase();

const filtres = ["tipus", "estat", "aula"];

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Ús: node filtres.js <filtre=valor> [filtre=valor]...");
    process.exit(1);
} 
const obj = Object.fromEntries(args.map(arg => arg.split("=")));

const desconegut = Object.keys(obj).find(key => !filtres.includes(key)); // undefined si tots els filtres són coneguts
if (desconegut !== undefined) {
    console.log(`Filtre desconegut: ${desconegut} (vàlids: ${filtres.join(", ")})`);
    process.exit(1);
}

const dadesFiltrades = dades.filter(elem =>
    filtres.every(f => obj[f] === undefined || tLC(obj[f]) === tLC(elem[f]))
);

console.log(`${dadesFiltrades.length} element(s):`)
dadesFiltrades.forEach(elem => {
    console.log(`- [${elem.id.slice(0,8)}] ${elem.nom} · ${elem.aula} · ${eur(elem.valor)}`);
});
