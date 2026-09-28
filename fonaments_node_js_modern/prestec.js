const fs = require("fs");
const path = require("path");

const PATH = path.join(__dirname, "data", "material.json");
const dades = JSON.parse(fs.readFileSync(PATH, "utf8"));

const [iniciId, persona] = process.argv.slice(2);

if (!iniciId || !persona) {
    console.log("Ús: node prestec.js <inici_id> <persona>");
    process.exit(1);
}

const elemId = dades.find(elem => elem.id.startsWith(iniciId));

if (!elemId) {
    console.log(`No s'ha trobat cap element amb id que comenci amb ${iniciId}`);
    process.exit(1);
}
if (elemId.estat !== "disponible") {
    const estat = `${elemId.estat} ${elemId.prestatA ? `a ${elemId.prestatA}` : ""}`;
    console.log(`No es pot prestar: està ${estat}`);
    process.exit(1);
}

const dadesNoves = dades.map(elem => {
    return elem.id === elemId.id
        ? {...elem, estat: "prestat", prestatA: persona, dataPrestec: new Date().toISOString()}
        : elem
});

fs.writeFileSync(PATH, JSON.stringify(dadesNoves, null, 2));
console.log(`Prestat: ${elemId.nom} → ${persona}`);
