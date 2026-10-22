// p3-nivells.js · Nivells de detall amb --verbose i --quiet
// Prova: node exemples/p3-nivells.js (i amb --verbose o --quiet)
const NIVELLS = { error: 0, warn: 1, info: 2, debug: 3 };
const args = process.argv.slice(2);
let nivell = "info";
if (args.includes("--quiet")) nivell = "error";
if (args.includes("--verbose")) nivell = "debug";

// Cada funció escriu a stderr si arriba al nivell triat
const log = {};
for (const [nom, valor] of Object.entries(NIVELLS)) {
  log[nom] = (missatge) => {
    if (valor <= NIVELLS[nivell]) console.error(missatge);
  };
}

log.debug("Llegint data/material.json"); // només --verbose
log.warn("4d6f: Portàtil Acer Aspire 3 està avariat");
log.info("Revisió acabada: 12 elements, 1 avís");
log.error("No es pot desar l'informe: disc ple"); // sempre
