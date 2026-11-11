// Pas 4: un client de terminal amb fetch
const API = "http://localhost:3000";
const json = { "Content-Type": "application/json" };
const ordre = process.argv[2];
const args = process.argv.slice(3);

const missatgeUs = () => {
  console.error("Ús: node client.js { llista [estat] | mostra <codi> | presta <codi> <persona> }");
  process.exit(2);
};

if (!ordre) missatgeUs();
else if (ordre === "llista" && args.length > 1) missatgeUs();
else if (ordre === "mostra" && args.length !== 1) missatgeUs();
else if (ordre === "presta" && args.length < 2) missatgeUs();

let ruta;
let metode = "GET";
let cos = null;

if (ordre === "llista") {
  ruta = "/material";
  if (args[0]) ruta += `?estat=${args[0]}`;
} else if (ordre === "mostra") {
  ruta = "/material/" + args[0];
} else if (ordre === "presta") {
  ruta = "/prestecs";
  metode = "POST";
  cos = JSON.stringify({ codi: args[0], persona: args.slice(1).join(" ") });
}

// En ES Modules, await funciona fora de funcions (top-level await)
let resposta;
try {
  resposta = await fetch(API + ruta, { method: metode, headers: cos ? json : {}, body: cos });
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
const elements = Array.isArray(dades) ? dades : [dades];
for (const elem of elements) {
  const { codi, nom, estat, prestatA } = elem;
  console.log(`${codi.padEnd(13)}  ${nom.padEnd(30)}  ${estat} ${prestatA ? `(${prestatA})` : ""}`);
}
