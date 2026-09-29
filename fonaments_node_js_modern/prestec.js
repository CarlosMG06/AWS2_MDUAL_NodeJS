const m = require("./material.js");

const [iniciId, persona] = process.argv.slice(2);
if (!iniciId || !persona) {
    console.log("Ús: node prestec.js <inici_id> <persona>");
    process.exit(1);
}

try {
    const dades = m.llegir();
    const elemId = m.cercar(dades, iniciId);
    const dadesNoves = m.prestar(dades, iniciId, persona);
    m.desar(dadesNoves);
    console.log(`Prestat: ${elemId.nom} → ${persona}`);
} catch (error) {
    console.log(error);
}
