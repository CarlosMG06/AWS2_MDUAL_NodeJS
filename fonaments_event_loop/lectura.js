const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const { batec } = require("./mesura.js");

const RUTA = path.join(__dirname, "gran.txt");

if (!fs.existsSync(RUTA)) {
    console.error("No s'ha trobat gran.txt");
    process.exit(1);
}

// part síncrona
const bSync = batec(10);
const iniciSync = performance.now();
for (let i = 0; i < 5; i++) {
    fs.readFileSync(RUTA, 'utf8');
}
const {tics, maxSalt} = bSync.atura();
const tempsTotal = Math.round(performance.now() - iniciSync);
console.log(`íncron: 5 lectures en ${tempsTotal} ms · tics: ${tics} · salt màxim: ${maxSalt}`);

// part asíncrona
console.log("Lectures asíncrones en marxa...");
const iniciAsync = performance.now();

const bAsync = batec(10);
let pendents = 5;
for (let i = 0; i < 5; i++) {
  fs.readFile(RUTA, 'utf8', (err, data) => {
    // si hi ha err: missatge i process.exit(1)
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
    pendents--;
    if (pendents === 0) {
      // l'última: atura el batec i mostra el resultat
      const {tics, maxSalt} = bAsync.atura();
      const tempsTotal = Math.round(performance.now() - iniciAsync);
      console.log(`Asíncron: 5 lectures en ${tempsTotal} ms · tics: ${tics} · salt màxim: ${maxSalt}`);
    }
  });
}

// en afegir llegir amb utf8, puja el salt màxim de l'asíncrona,
// perquè la decodificació utf8 es fa en el fil principal,
// i no pas en el thread pool com la lectura en si dels bytes del fitxer