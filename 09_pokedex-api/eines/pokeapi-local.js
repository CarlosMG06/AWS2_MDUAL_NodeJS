// Ve fet · una PokéAPI de mentida, per si la xarxa del centre no deixa arribar a pokeapi.co.
// 1) npm run pokeapi-local   2) al .env: POKEAPI_URL=http://localhost:3999/api/v2   3) npm run dev
// Només té uns quants Pokémon. Un número que no hi és torna un dels que hi ha.
import http from "node:http";

const PORT = 3999;
const BASE = `http://localhost:${PORT}/api/v2`;
const ARTWORK = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

// id, nom, tipus, alçada (dm), pes (hg), vida, atac, defensa, velocitat
const DADES = [
  [1, "bulbasaur", ["grass", "poison"], 7, 69, 45, 49, 49, 45],
  [2, "ivysaur", ["grass", "poison"], 10, 130, 60, 62, 63, 60],
  [3, "venusaur", ["grass", "poison"], 20, 1000, 80, 82, 83, 80],
  [4, "charmander", ["fire"], 6, 85, 39, 52, 43, 65],
  [5, "charmeleon", ["fire"], 11, 190, 58, 64, 58, 80],
  [6, "charizard", ["fire", "flying"], 17, 905, 78, 84, 78, 100],
  [7, "squirtle", ["water"], 5, 90, 44, 48, 65, 43],
  [25, "pikachu", ["electric"], 4, 60, 35, 55, 40, 90],
  [37, "vulpix", ["fire"], 6, 99, 38, 41, 40, 65],
  [38, "ninetales", ["fire"], 11, 199, 73, 76, 75, 100],
  [94, "gengar", ["ghost", "poison"], 15, 405, 60, 65, 60, 110],
  [133, "eevee", ["normal"], 3, 65, 55, 55, 50, 55],
  [143, "snorlax", ["normal"], 21, 4600, 160, 110, 65, 30],
  [150, "mewtwo", ["psychic"], 20, 1220, 106, 110, 90, 130],
  [448, "lucario", ["fighting", "steel"], 12, 540, 70, 110, 70, 90],
];
const TIPUS = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel",
  "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];

// El mateix format que PokéAPI (només els camps que fa servir el projecte)
function pokemon([id, name, tipus, height, weight, hp, attack, defense, speed]) {
  return {
    id, name, height, weight,
    types: tipus.map((t, i) => ({ slot: i + 1, type: { name: t, url: `${BASE}/type/${t}/` } })),
    sprites: { front_default: null, other: { "official-artwork": { front_default: `${ARTWORK}/${id}.png` } } },
    stats: Object.entries({ hp, attack, defense, speed })
      .map(([nom, valor]) => ({ base_stat: valor, stat: { name: nom } })),
  };
}
const ref = ([id, name]) => ({ name, url: `${BASE}/pokemon/${id}/` });

function respondre(res, status, dades) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(dades));
}

http.createServer((req, res) => {
  const url = new URL(req.url, BASE);
  const parts = url.pathname.split("/").filter(Boolean); // ["api","v2","pokemon","25"]
  const [recurs, clau] = parts.slice(2);

  if (recurs === "pokemon" && !clau) {
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    return respondre(res, 200, { count: DADES.length, results: DADES.slice(offset, offset + limit).map(ref) });
  }
  if (recurs === "pokemon") {
    let fila = DADES.find(([id, nom]) => nom === clau || String(id) === clau);
    const n = Number(clau);
    if (!fila && Number.isInteger(n) && n >= 1 && n <= 1025) fila = DADES[(n - 1) % DADES.length];
    return fila ? respondre(res, 200, pokemon(fila)) : (res.writeHead(404), res.end("Not Found"));
  }
  if (recurs === "type" && TIPUS.includes(clau)) {
    const llista = DADES.filter(([, , tipus]) => tipus.includes(clau));
    return respondre(res, 200, { name: clau, pokemon: llista.map((f) => ({ pokemon: ref(f), slot: 1 })) });
  }
  res.writeHead(404);
  res.end("Not Found");
}).listen(PORT, () => console.log(`PokéAPI local a ${BASE}`));
