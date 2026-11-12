const fs = require("fs");
const path = require("path");

const dades = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "material.json")));

dades.forEach(elem => {
    const valor = `${elem.valor} €` ?? "sense valor";
    const lloc = elem.prestatA?.toUpperCase() || `a l'aula ${elem.aula}`;
    console.log(`${elem.nom} · ${valor} · ${lloc}`);
});
// cas de valor : he triat ?? perquè mostri valor 0
// cas de lloc  : he triat || perquè en cas que hi hagi un string buit, mostri l'aula