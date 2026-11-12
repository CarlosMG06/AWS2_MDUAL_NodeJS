// Ve fet · Comprova la teva API. Engega-la abans amb npm start (en un altre terminal).
const API = process.env.API_URL ?? "http://localhost:3000";

const PROVES = [
  { ruta: "/temps/Barcelona", estat: 200 },
  { ruta: "/temps/Sant%20Cugat%20del%20Vall%C3%A8s", estat: 200 },
  { ruta: "/temps/Xyzzyqwk", estat: 404 },
  { ruta: "/compara?ciutats=Barcelona,Girona,Lleida", estat: 200 },
  { ruta: "/compara?ciutats=Barcelona", estat: 400 },
  { ruta: "/res", estat: 404 },
];

function resum(dades) {
  if (dades.error) return dades.error;
  if (Array.isArray(dades)) return dades.map((t) => t.ciutat).join(" > ");
  return `${dades.ciutat} (${dades.pais}) ${dades.temperatura} °C`;
}

let errors = 0;
for (const [i, prova] of PROVES.entries()) {
  let resposta;
  try {
    resposta = await fetch(API + prova.ruta);
  } catch {
    console.error(`No es pot connectar amb ${API}. Has fet npm start?`);
    process.exit(1);
  }
  const dades = await resposta.json();
  const correcte = resposta.status === prova.estat;
  if (!correcte) errors++;
  const marca = correcte ? "ok   " : `ERROR (s'esperava ${prova.estat})`;
  console.log(`${i + 1}. GET ${prova.ruta.padEnd(42)} → ${resposta.status} ${marca} ${resum(dades)}`);
}

console.log(errors === 0 ? "Tot correcte" : `Proves fallades: ${errors}`);
process.exit(errors === 0 ? 0 : 1);
