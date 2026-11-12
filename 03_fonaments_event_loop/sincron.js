const fs = require("node:fs");
const dades = fs.readFileSync("gran.txt");
console.log(`Llegits ${dades.length} bytes`);
console.log("Fet");
