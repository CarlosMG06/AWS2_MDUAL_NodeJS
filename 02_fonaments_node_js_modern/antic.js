// antic.js · Codi escrit "a l'estil de fa deu anys" (ES5).
// Repte: reescriu-lo en JavaScript modern a modern.js.
// La sortida ha de ser EXACTAMENT la mateixa.
var fs = require("fs");

var dades = JSON.parse(fs.readFileSync(__dirname + "/data/material.json", "utf8"));
var total = 0;
var disponibles = [];

for (var i = 0; i < dades.length; i++) {
  total = total + dades[i].valor;
  if (dades[i].estat == "disponible") {
    disponibles.push(dades[i].nom + " (" + dades[i].aula + ")");
  }
}

console.log("Elements: " + dades.length);
console.log("Valor total: " + total + " euros");
console.log("Disponibles: " + disponibles.length);
for (var j = 0; j < disponibles.length; j++) {
  console.log("  - " + disponibles[j]);
}
