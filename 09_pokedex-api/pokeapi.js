import { error } from "./errors.js";

// Tot el que parla amb PokéAPI és aquí: les rutes no fan cap fetch.
export const BASE = process.env.POKEAPI_URL ?? "https://pokeapi.co/api/v2";

// Temps màxim d'espera: si PokéAPI no respon, no deixem el client penjat
const TEMPS_MAXIM = Number(process.env.POKEAPI_TIMEOUT_MS ?? 5000);

// Memòria cau: PokéAPI és gratuïta i demana no repetir les mateixes peticions
const cau = new Map();

// Converteix un error de fetch en un error HTTP de la nostra API
function errorDeXarxa(err) {
  if (err.name === "TimeoutError") return error(504, "PokéAPI no ha respost a temps");
  return error(502, "No es pot connectar amb PokéAPI");
}

async function demanar(ruta) {
  if (cau.has(ruta)) return cau.get(ruta);

  let resposta;
  try {
    // AbortSignal.timeout cancel·la la petició si triga massa
    resposta = await fetch(BASE + ruta, { signal: AbortSignal.timeout(TEMPS_MAXIM) });
  } catch (err) {
    // fetch només falla si no arriba cap resposta (o si s'ha esgotat el temps)
    throw errorDeXarxa(err);
  }
  if (resposta.status === 404) throw error(404, "No existeix a PokéAPI");
  if (!resposta.ok) throw error(502, `PokéAPI ha respost ${resposta.status}`);

  let dades;
  try {
    dades = await resposta.json(); // el temps màxim també compta mentre arriba el cos
  } catch (err) {
    throw errorDeXarxa(err);
  }
  cau.set(ruta, dades);
  return dades;
}

// L'id és l'últim número de la URL: ".../pokemon/25/" → 25
export function idDeUrl(url) {
  return Number(url.split("/").filter(Boolean).at(-1));
}

export async function llistar(limit, offset) {
  const dades = await demanar(`/pokemon?limit=${limit}&offset=${offset}`);
  return {
    total: dades.count,
    resultats: dades.results.map((p) => ({ id: idDeUrl(p.url), nom: p.name })),
  };
}

// ---------- Pas 1 · Un Pokémon, simplificat
// TODO: simplificar(p) · de la resposta de PokéAPI, només id, nom, tipus,
//       alcada (m), pes (kg), imatge i estadistiques { vida, atac, defensa, velocitat }
// TODO: obtenir(nomOId) · demana /pokemon/<nom> i el retorna simplificat.
//       Si PokéAPI diu 404: error(404, `No hi ha cap Pokémon anomenat ${nomOId}`)

// ---------- Pas 2 · Tots els Pokémon d'un tipus
// TODO: perTipus(tipus) · demana /type/<tipus> i retorna [{ id, nom }, …]
//       Si el tipus no existeix: error(400, `Tipus no vàlid: ${tipus}`)
