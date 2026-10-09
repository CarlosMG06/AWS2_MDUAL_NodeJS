const fs = require("node:fs");
const path = require("node:path");

const filename = "gran.txt";
const PATH = path.join(__dirname, filename);

const arr = Array.from(
    [...Array(1000000).keys()],
    (x) => `Línia ${x.toString().padStart(7, "0")} · El fil principal no s'ha d'aturar mai`
);

fs.writeFileSync(PATH, arr.join("\n"));

const bytes = fs.statSync(PATH).size;
const MB = Math.round(bytes/1024**2*10)/10;
console.log(`${filename}: ${arr.length} línies · ${MB} MB`);