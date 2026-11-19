// Tot el que sap parlar amb Open-Meteo és aquí. La resta del projecte no en coneix les URL.
import { descripcio } from "./codis.js";

const URL_CIUTATS = "https://geocoding-api.open-meteo.com/v1/search";
const URL_PREVISIO = "https://api.open-meteo.com/v1/forecast";
const TEMPS_MAXIM = 5; // segons
const MAXIM_CIUTATS = 5;

// Funció interna: un error amb el codi d'estat que haurà de respondre el servidor
function error(status, missatge, causa) {
  const err = new Error(missatge, { cause: causa });
  err.status = status;
  return err;
}

// Funció interna: fa la petició i converteix qualsevol fallada d'Open-Meteo en un 502
async function demanar(url, fetchFn) {
  let resposta;
  try {
    resposta = await fetchFn(url, { signal: AbortSignal.timeout(TEMPS_MAXIM) });
  } catch (err) {
    // Sense xarxa, o han passat els 5 segons
    throw error(502, "Open-Meteo no respon", err);
  }
  if (!resposta.ok) {
    throw error(502, `Open-Meteo ha respost ${resposta.status}`);
  }
  return resposta.json();
}

// Nom d'una ciutat → les seves coordenades
export async function cercarCiutat(nom, fetchFn = fetch) {
  if (typeof nom !== "string" || nom.trim() === "") {
    throw error(400, "Cal el nom de la ciutat");
  }
  const url = new URL(URL_CIUTATS);
  url.searchParams.set("name", nom.trim());
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "ca");

  const dades = await demanar(url, fetchFn);
  // Si no troba res, Open-Meteo respon 200 sense la propietat results
  if (!dades.results?.length) {
    throw error(404, `No s'ha trobat la ciutat: ${nom.trim()}`);
  }
  const { name, country_code, latitude, longitude } = dades.results[0];
  return { nom: name, pais: country_code, latitud: latitude, longitud: longitude };
}

// Coordenades → el temps que hi fa ara
export async function tempsActual({ latitud, longitud }, fetchFn = fetch) {
  const url = new URL(URL_PREVISIO);
  url.searchParams.set("latitude", latitud);
  url.searchParams.set("longitude", longitud);
  url.searchParams.set("current", "temperature_2m,wind_speed_10m,weather_code");

  const { current } = await demanar(url, fetchFn);
  return {
    temperatura: current.temperature_2m,
    vent: current.wind_speed_10m,
    descripcio: descripcio(current.weather_code),
  };
}

// Dues crides en sèrie: la segona necessita el resultat de la primera
export async function tempsDe(nom, fetchFn = fetch) {
  const ciutat = await cercarCiutat(nom, fetchFn);
  const temps = await tempsActual(ciutat, fetchFn);
  return { ciutat: ciutat.nom, pais: ciutat.pais, ...temps };
}

// Diverses ciutats alhora: no depenen les unes de les altres
export async function comparar(noms, fetchFn = fetch) {
  if (!Array.isArray(noms) || noms.length < 2 || noms.length > MAXIM_CIUTATS) {
    throw error(400, `Calen entre 2 i ${MAXIM_CIUTATS} ciutats`);
  }
  const resultats = await Promise.all(noms.map((nom) => tempsDe(nom, fetchFn)));
  // De més calenta a més freda, sense modificar l'array original
  return resultats.toSorted((a, b) => a.temperatura - b.temperatura);
}
