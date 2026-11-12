// Model 2 · Una petició a Open-Meteo, amb temps màxim i comprovació de la resposta
// Executa'l: node exemples/e2-open-meteo.js
// Documentació: https://open-meteo.com/en/docs

// Les coordenades de Cornellà de Llobregat, posades a mà.
// Al projecte les hauràs d'obtenir amb l'altra API d'Open-Meteo:
// https://geocoding-api.open-meteo.com/v1/search?name=Girona&count=1&language=ca
const url = new URL("https://api.open-meteo.com/v1/forecast");
url.searchParams.set("latitude", 41.35);
url.searchParams.set("longitude", 2.07);
// current: les dades d'ara mateix que vols, separades per comes.
// Al projecte et caldrà també wind_speed_10m
url.searchParams.set("current", "temperature_2m,weather_code");
console.log(`GET ${url}`);

let resposta;
try {
  // Si Open-Meteo triga més de 5 segons, la petició s'avorta i fetch llança un error
  resposta = await fetch(url, { signal: AbortSignal.timeout(5000) });
} catch (err) {
  console.error(`Open-Meteo no respon: ${err.message}`);
  process.exit(1);
}

if (!resposta.ok) {
  console.error(`Open-Meteo ha respost ${resposta.status}`);
  process.exit(1);
}

const dades = await resposta.json();
console.log(dades.current); // l'objecte amb la temperatura i el codi del cel
