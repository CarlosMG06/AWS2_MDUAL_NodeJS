// prova-api.js · Envia unes quantes peticions a l'API i en mostra l'estat (ve fet)
// Ús: amb el servidor engegat, en un altre terminal: npm run prova-api
const API = process.env.API_URL ?? "http://localhost:3000";
const json = { "Content-Type": "application/json" };

const peticions = [
  ["GET", "/material"],
  ["GET", "/material?estat=prestat"],
  ["GET", "/material?estat=perdut"],
  ["GET", "/material/INV-2026-0001"],
  ["GET", "/material/INV-0000"],
  ["POST", "/prestecs", JSON.stringify({ codi: "INV-2026-0004", persona: "Marta" })],
  ["POST", "/prestecs", JSON.stringify({ codi: "INV-2026-0004", persona: "Pau" })],
  ["POST", "/prestecs", JSON.stringify({ codi: "INV-2026-0005", persona: "" })],
  ["POST", "/prestecs", "això no és JSON"],
  ["GET", "/res"],
];

for (const [n, [metode, ruta, cos]] of peticions.entries()) {
  try {
    const resposta = await fetch(API + ruta, { method: metode, headers: cos ? json : {}, body: cos });
    const dades = await resposta.json();
    const detall = dades.error ?? (Array.isArray(dades) ? `${dades.length} elements` : dades.nom ?? "");
    console.log(`${String(n + 1).padStart(2)}. ${metode.padEnd(4)} ${ruta.padEnd(26)} → ${resposta.status} ${detall}`);
  } catch (err) {
    console.error(`No es pot connectar amb ${API}: ${err.cause?.code ?? err.message}`);
    process.exit(1);
  }
}
console.log("Per repetir-ho: atura el servidor, npm run reset i torna'l a engegar");
