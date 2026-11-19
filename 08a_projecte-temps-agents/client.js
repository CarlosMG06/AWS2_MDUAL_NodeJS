// El client només coneix la nostra API: no sap res d'Open-Meteo
const API = process.env.API ?? "http://localhost:3000";

const US = `Ús:
  node client.js temps <ciutat>
  node client.js compara <ciutat> <ciutat> [més ciutats]`;

async function demanar(ruta) {
  let resposta;
  try {
    resposta = await fetch(API + ruta);
  } catch (err) {
    // fetch només falla si no hi ha resposta (servidor aturat…)
    const motiu = err.cause?.code ?? err.message;
    console.error(`No es pot connectar amb ${API}: ${motiu}`);
    process.exit(1);
  }

  const dades = await resposta.json();
  if (!resposta.ok) {
    // 4xx o 5xx: hi ha resposta, però és un error
    console.error(`Error ${resposta.status}: ${dades.error}`);
    process.exit(1);
  }
  return dades;
}

function linia(t) {
  const lloc = `${t.ciutat} (${t.pais})`.padEnd(26);
  const graus = `${t.temperatura.toFixed(1)} °C`.padStart(8);
  const vent = `vent ${t.vent.toFixed(1)} km/h`.padEnd(16);
  return `${lloc}${graus}  ${vent}${t.descripcio}`;
}

const [ordre, ...args] = process.argv.slice(2);

if (ordre === "temps" && args.length > 0) {
  // El nom pot tenir espais: node client.js temps Sant Cugat del Vallès
  const ciutat = args.join(" ");
  const temps = await demanar(`/temps/${encodeURIComponent(ciutat)}`);
  console.log(linia(temps));
} else if (ordre === "compara" && args.length >= 2) {
  // Aquí cada argument és una ciutat: les que tenen espais, entre cometes
  const llista = await demanar(`/compara?ciutats=${encodeURIComponent(args.join(","))}`);
  for (const temps of llista) {
    console.log(linia(temps));
  }
} else {
  console.error(US);
  process.exit(2); // 2: ús incorrecte
}
