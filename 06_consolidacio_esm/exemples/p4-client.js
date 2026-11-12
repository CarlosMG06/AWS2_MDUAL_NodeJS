// p4-client.js · Model del Pas 4: un client de terminal amb fetch
// Prova: engega node exemples/p2-servidor.js i, en un altre terminal,
//        node exemples/p4-client.js 30   o bé   node exemples/p4-client.js A12
const API = process.env.API_URL ?? "http://localhost:3001";
const arg = process.argv[2];

if (!arg) {
  console.error("Ús: node exemples/p4-client.js <places mínimes | nom de l'aula>");
  process.exit(2); // 2: ús incorrecte
}

// Amb un número, la llista d'aules; amb un nom, una sola aula
const ruta = Number.isNaN(Number(arg)) ? `/aules/${arg}` : `/aules?places=${arg}`;

// En ES Modules, await funciona fora de funcions (top-level await)
let resposta;
try {
  resposta = await fetch(API + ruta);
} catch (err) {
  // fetch només falla si no hi ha resposta (servidor aturat…)
  const motiu = err.cause?.code ?? err.message;
  console.error(`No es pot connectar amb ${API}: ${motiu}`);
  process.exit(1); // 1: error
}

const dades = await resposta.json();
if (!resposta.ok) {
  // 4xx o 5xx: hi ha resposta, però és un error
  console.error(`Error ${resposta.status}: ${dades.error}`);
  process.exit(1);
}

// El resultat, a stdout; els missatges, a stderr
const aules = Array.isArray(dades) ? dades : [dades];
for (const aula of aules) {
  console.log(`${aula.nom.padEnd(12)} ${aula.places} places`);
}
