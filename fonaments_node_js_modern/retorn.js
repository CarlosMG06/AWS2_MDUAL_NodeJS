const fs = require("fs");
const path = require("path");

const PATH = path.join(__dirname, "data", "material.json");
const dades = JSON.parse(fs.readFileSync(PATH, "utf8"));

const iniciId = process.argv[2];

if (!iniciId) {
    console.log("Ús: node retorn.js <inici_id>");
    process.exit(1);
}

const elemId = dades.find(elem => elem.id.startsWith(iniciId));

if (!elemId) {
    console.log(`No s'ha trobat cap element amb id que comenci amb ${iniciId}`);
    process.exit(1);
}
if (elemId.estat !== "prestat") {
    console.log(`No es pot retornar: està ${elemId.estat}`);
    process.exit(1);
}

const {prestatA, dataPrestec, ...resta} = elemId;
const dadesNoves = dades.map(elem => {
    return elem.id === elemId.id
        ? {...resta, estat: "disponible"}
        : elem
});

fs.writeFileSync(PATH, JSON.stringify(dadesNoves, null, 2));
console.log(`Retornat: ${elemId.nom} (el tenia ${prestatA})`);
