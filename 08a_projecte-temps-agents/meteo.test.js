import test from "node:test";
import assert from "node:assert/strict";
import { cercarCiutat, tempsDe, comparar } from "./meteo.js";

// Un fetch fals: els tests no depenen de la xarxa ni del temps que faci avui.
// Rep les temperatures de cada ciutat i respon com ho faria Open-Meteo.
function fetchFals(temperatures) {
  const ciutats = Object.keys(temperatures);
  return async (url) => {
    const adreca = new URL(url);
    let dades;
    if (adreca.hostname.startsWith("geocoding")) {
      const index = ciutats.indexOf(adreca.searchParams.get("name"));
      dades = index === -1
        ? {}
        : { results: [{ name: ciutats[index], country_code: "ES", latitude: index, longitude: 0 }] };
    } else {
      const ciutat = ciutats[Number(adreca.searchParams.get("latitude"))];
      dades = { current: { temperature_2m: temperatures[ciutat], wind_speed_10m: 10, weather_code: 0 } };
    }
    return { ok: true, status: 200, json: async () => dades };
  };
}

const fals = fetchFals({ Girona: 12.5, Lleida: 9, Tarragona: 17.2 });

test("cercarCiutat retorna el nom, el país i les coordenades", async () => {
  const ciutat = await cercarCiutat("Lleida", fals);
  assert.deepEqual(ciutat, { nom: "Lleida", pais: "ES", latitud: 1, longitud: 0 });
});

test("cercarCiutat rebutja una ciutat que no existeix (404)", async () => {
  await assert.rejects(() => cercarCiutat("Xyzzy", fals), { status: 404 });
});

test("cercarCiutat rebutja un nom buit (400) sense fer cap petició", async () => {
  const noCridar = () => assert.fail("no s'havia de cridar fetch");
  await assert.rejects(() => cercarCiutat("   ", noCridar), { status: 400 });
});

test("tempsDe ajunta la ciutat i el temps en un sol objecte", async () => {
  assert.deepEqual(await tempsDe("Girona", fals), {
    ciutat: "Girona",
    pais: "ES",
    temperatura: 12.5,
    vent: 10,
    descripcio: "Cel serè",
  });
});

test("tempsDe respon 502 si Open-Meteo no contesta", async () => {
  const caigut = async () => {
    throw new TypeError("fetch failed");
  };
  await assert.rejects(() => tempsDe("Girona", caigut), { status: 502 });
});

test("comparar ordena de més calenta a més freda", async () => {
  const resultat = await comparar(["Lleida", "Tarragona", "Girona"], fals);
  assert.deepEqual(resultat.map((t) => t.ciutat), ["Tarragona", "Girona", "Lleida"]);
});

test("comparar rebutja una sola ciutat (400)", async () => {
  await assert.rejects(() => comparar(["Girona"], fals), { status: 400 });
});
