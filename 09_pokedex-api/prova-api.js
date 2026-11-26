// Ve fet · prova totes les rutes de l'activitat. Cal el servidor engegat (npm run dev).
// Els preferits viuen en memòria: per repetir la prova, reinicia el servidor.
const API = process.env.API_URL ?? "http://localhost:3000";

const casos = [
  ["GET", "/pokemon?limit=3"],
  ["GET", "/pokemon?limit=500"],
  ["GET", "/pokemon/pikachu"],
  ["GET", "/pokemon/Pikachu"],
  ["GET", "/pokemon/digimon"],
  ["GET", "/pokemon?tipus=fire&limit=5"],
  ["GET", "/pokemon?tipus=foc"],
  ["GET", "/quin-pokemon-ets/Alba%20Sala"],
  ["POST", "/preferits", { nom: "pikachu" }],
  ["POST", "/preferits", { nom: "pikachu" }],
  ["POST", "/preferits", {}],
  ["POST", "/preferits", "{ això no és JSON"],
  ["GET", "/preferits"],
  ["GET", "/res"],
];

// Una línia curta per resposta
function resum(dades) {
  if (dades.buit) return "(sense cos)";
  if (dades.error) return dades.error;
  if (dades.frase) return dades.frase;
  if (dades.preferits) return `${dades.total} preferits`;
  if (dades.resultats) {
    const noms = dades.resultats.map((p) => p.nom);
    return noms.length > 5 ? `${noms.slice(0, 5).join(", ")}… (${noms.length})` : noms.join(", ");
  }
  if (dades.nom) return `#${dades.id} ${dades.nom} (${dades.tipus.join(", ")})`;
  return JSON.stringify(dades);
}

for (const [i, [metode, ruta, cos]] of casos.entries()) {
  const opcions = { method: metode };
  if (cos !== undefined) {
    opcions.headers = { "Content-Type": "application/json" };
    opcions.body = typeof cos === "string" ? cos : JSON.stringify(cos);
  }

  let resposta;
  try {
    resposta = await fetch(API + ruta, opcions);
  } catch (err) {
    console.error(`No es pot connectar amb ${API}: ${err.cause?.code ?? err.message}`);
    process.exit(1);
  }

  const text = await resposta.text();
  let dades = { buit: true }; // un 204 no porta cos
  if (text !== "") {
    try {
      dades = JSON.parse(text);
    } catch {
      dades = { error: "La resposta no és JSON" };
    }
  }
  const num = String(i + 1).padStart(2);
  console.log(`${num}. ${metode.padEnd(4)} ${ruta.padEnd(30)} → ${resposta.status} ${resum(dades)}`);
}
