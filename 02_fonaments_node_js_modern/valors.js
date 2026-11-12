const fs = require("fs");
const path = require("path");

const dades = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "material.json")));

const format = new Intl.NumberFormat("ca-ES", {
  style: "currency",
  currency: "EUR",
});
const euros = (valor) => format.format(valor); 
const linia = (element) => `${element.nom.padEnd(30)} · ${element.aula.padEnd(10)} · ${euros(element.valor)}`;

dades.forEach(dada => {
  console.log(linia(dada));
});