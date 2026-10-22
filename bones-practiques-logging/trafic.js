// trafic.js · Simula un matí de peticions a l'API de l'inventari
// Ve fet. Amb el servidor engegat (npm start), en un altre terminal: npm run trafic
const http = require("node:http");

const PORT = Number(process.env.PORT ?? 3000);
const TOKEN = process.env.TOKEN ?? "aula-2026";
const amb = { Authorization: `Bearer ${TOKEN}` };

const peticions = [
  ["GET", "/material"],
  ["GET", "/material?estat=disponible"],
  ["GET", "/material/f38b"],
  ["POST", "/prestecs", amb, { id: "f38b", persona: { nom: "Marta Puig", email: "marta.puig@institut.cat" } }],
  ["GET", "/material/zzzz"],
  ["POST", "/prestecs", amb, { id: "e512", persona: { nom: "Pau Soler", email: "pau.soler@institut.cat" } }],
  ["POST", "/prestecs", {}, { id: "7dab", persona: { nom: "Pau Soler", email: "pau.soler@institut.cat" } }],
  ["POST", "/prestecs", amb, { id: "7dab", persona: { nom: "Laia Vidal", email: "laia.vidal@gmail.com" } }],
  ["GET", "/material/f3"],
  // L'app antiga del mòbil no envia el correu
  ["POST", "/prestecs", amb, { id: "9a1c", persona: { nom: "Marta Puig" } }],
  ["POST", "/prestecs", amb, { id: "c1d3", persona: { nom: "Joan Roca", email: "joan.roca@institut.cat" } }],
];

function envia(i) {
  if (i === peticions.length) {
    console.log("\nFet. Per repetir-ho: atura el servidor, npm run reset i torna'l a engegar.");
    return;
  }
  const [metode, ruta, capcaleres = {}, cos] = peticions[i];
  const text = cos ? JSON.stringify(cos) : "";
  const opcions = {
    port: PORT,
    method: metode,
    path: ruta,
    headers: { ...capcaleres, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(text) },
  };
  const req = http.request(opcions, (res) => {
    let resposta = "";
    res.on("data", (tros) => (resposta += tros));
    res.on("end", () => {
      const ref = res.headers["x-request-id"];
      const error = res.statusCode >= 400 ? ` ${JSON.parse(resposta).error}` : "";
      console.log(`${String(i + 1).padStart(2)}. ${metode.padEnd(4)} ${ruta.padEnd(28)} → ${res.statusCode}${error}${ref ? ` (ref. ${ref.slice(0, 8)})` : ""}`);
      envia(i + 1);
    });
  });
  req.on("error", (err) => {
    console.error(`No es pot connectar amb el servidor (${err.code}). L'has engegat amb npm start?`);
    process.exitCode = 1;
  });
  req.end(text);
}

envia(0);
