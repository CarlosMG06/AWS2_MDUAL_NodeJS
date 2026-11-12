const m = require("./material.js");

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Ús: node filtres.js <filtre=valor> [filtre=valor]...");
    process.exit(1);
} 
const filtres = Object.fromEntries(args.map(arg => arg.split("=")));

try {
    const dades = m.llegir();
    const dadesFiltrades = m.filtrar(dades, filtres);
    console.log(`${dadesFiltrades.length} element(s):`)
    dadesFiltrades.forEach(elem => console.log(m.linia(elem)));
} catch (error) {
    console.log(error);
}
