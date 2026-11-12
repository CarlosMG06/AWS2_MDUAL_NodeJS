const fs = require("node:fs");
const material = [
  { nom: "HP 14", valor: 450, estat: "disponible" },
  { nom: "iPad", valor: 0, estat: "disponible" },
  { nom: "BenQ", valor: 310, estat: "prestat" },
];
function valorTotal(llista) {
  return llista.reduce((suma, m) => suma + m.valor, 0);
}
const disponibles = material.filter((m) => m.estat === "disponible");
if (disponibles.length > 0) {
  console.log(`Disponibles: ${disponibles.length}`);
}
console.log("Valor total: " + valorTotal(material) + " €");
module.exports = { valorTotal, fs };
