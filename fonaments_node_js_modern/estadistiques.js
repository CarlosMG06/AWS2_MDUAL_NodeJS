const fs = require("fs");
const path = require("path");

const dades = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "material.json")));

const format = new Intl.NumberFormat("ca-ES", {
  style: "currency",
  currency: "EUR",
});
const eur = (valor) => format.format(valor); 
const boolToStr = (bool) => bool ? "sí" : "no";

const vTotal = dades.reduce((suma, elem) => suma + elem.valor, 0);
const vMitja = vTotal / dades.length;
const vMax = dades.reduce((max, elem) => (elem.valor > max.valor ? elem : max));

const perTipus = dades.reduce((sumes, elem) => {
    if (!sumes[elem.tipus]) sumes[elem.tipus] = 0;
    sumes[elem.tipus]++;
    return sumes;
}, {});
const perAula = Object.groupBy(dades, elem => elem.aula);

const materialAvariat = dades.some(elem => elem.estat === "avariat");
const totTeAula =  dades.every(elem => elem.aula);

console.log(`Elements: ${dades.length} · Valor total: ${eur(vTotal)}`);
console.log(`Valor mitjà: ${eur(vMitja)}`);
console.log("Per tipus:", Object.keys(perTipus).map(tipus => `${tipus} ${perTipus[tipus]}`).join(" · "));
console.log("Per aula: ", Object.keys(perAula).map(aula => `${aula} ${perAula[aula].length}`).join(" · "));
console.log(`Més valuós: ${vMax.nom} (${eur(vMax.valor)})`);
console.log(`Hi ha material avariat? ${boolToStr(materialAvariat)}`);
console.log(`Tot té aula assignada? ${boolToStr(totTeAula)}`);
