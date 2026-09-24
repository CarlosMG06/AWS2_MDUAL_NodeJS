const fs = require("fs");

const dades = JSON.parse(fs.readFileSync(__dirname + "/data/material.json", "utf8"));
let total = 0;
for (let i = 0; i < dades.length; i++) {
  total = total + dades[i].valor;
}

const disponibles = dades
  .filter((dada) => dada.estat == "disponible")
  .map((dada) => `${dada.nom} (${dada.aula})`);

console.log(`Elements: ${dades.length}`);
console.log(`Valor total: ${total} euros`);
console.log(`Disponibles: ${disponibles.length}`);
disponibles.forEach(element => {
  console.log(`  - ${element}`);
});

// No sé com utilitzar "reduce" 
// filter, map i forEach els conec per haver-los utilitzat en Python i Java