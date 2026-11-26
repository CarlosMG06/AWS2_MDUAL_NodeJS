// PokéAPI local: les mateixes rutes i el mateix format que https://pokeapi.co/api/v2,
// amb les dades dels 1.025 Pokémon guardades a dades/. No cal internet ni cap dependència.
//
//   npm start                → http://localhost:3999/api/v2
//   PORT=4000 npm start      → un altre port
//
// Rutes:
//   GET /api/v2/pokemon?limit=20&offset=0    llista paginada
//   GET /api/v2/pokemon/{nom o id}           un Pokémon
//   GET /api/v2/type                         llista de tipus
//   GET /api/v2/type/{nom o id}              Pokémon d'un tipus
//   GET /sprites/pokemon/{id}.png            imatge (96 × 96)
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PORT = Number(process.env.PORT ?? 3999);
const DIR = import.meta.dirname;

const POKEMON = JSON.parse(fs.readFileSync(path.join(DIR, "dades/pokemon.json"), "utf8"));
const TIPUS = JSON.parse(fs.readFileSync(path.join(DIR, "dades/tipus.json"), "utf8"));
const PER_ID = new Map(POKEMON.map((p) => [String(p.id), p]));
const PER_NOM = new Map(POKEMON.map((p) => [p.name, p]));
const TIPUS_PER_ID = new Map(Object.values(TIPUS).map((t) => [String(t.id), t]));

function enviar(res, status, dades) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(dades));
}

function noTrobat(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end("Not Found");
}

// Les URLs de la resposta apunten a aquest mateix servidor (localhost o la IP del docent)
function origen(req) {
  return `http://${req.headers.host ?? `localhost:${PORT}`}`;
}

function pokemonComplet(p, base) {
  return {
    id: p.id,
    name: p.name,
    height: p.height,
    weight: p.weight,
    types: p.types.map((t) => ({ slot: t.slot, type: { name: t.type.name, url: `${base}/api/v2/type/${t.type.name}/` } })),
    stats: p.stats,
    sprites: {
      front_default: `${base}/sprites/pokemon/${p.id}.png`,
      other: { "official-artwork": { front_default: null } }, // sense imatges grans: ocupen massa
    },
  };
}

function enter(valor, perDefecte) {
  const n = Number(valor ?? perDefecte);
  return Number.isInteger(n) && n >= 0 ? n : perDefecte;
}

const servidor = http.createServer((req, res) => {
  const base = origen(req);
  const url = new URL(req.url, base);
  const parts = url.pathname.split("/").filter(Boolean);
  console.log(`${req.method} ${req.url}`);

  if (req.method !== "GET") return noTrobat(res);

  // Imatges
  if (parts[0] === "sprites" && parts[1] === "pokemon" && /^\d+\.png$/.test(parts[2] ?? "")) {
    const fitxer = path.join(DIR, "sprites/pokemon", parts[2]);
    if (!fs.existsSync(fitxer)) return noTrobat(res);
    res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400", "Access-Control-Allow-Origin": "*" });
    return fs.createReadStream(fitxer).pipe(res);
  }

  if (parts[0] !== "api" || parts[1] !== "v2") {
    return enviar(res, 200, {
      servei: "PokéAPI local",
      pokemon: POKEMON.length,
      api: `${base}/api/v2`,
      exemples: [`${base}/api/v2/pokemon/pikachu`, `${base}/api/v2/pokemon?limit=5`, `${base}/api/v2/type/fire`],
    });
  }

  const [recurs, clau] = parts.slice(2).map((s) => decodeURIComponent(s).toLowerCase());

  if (recurs === "pokemon" && !clau) {
    const limit = enter(url.searchParams.get("limit"), 20);
    const offset = enter(url.searchParams.get("offset"), 0);
    const pagina = (o) => `${base}/api/v2/pokemon?offset=${o}&limit=${limit}`;
    return enviar(res, 200, {
      count: POKEMON.length,
      next: offset + limit < POKEMON.length ? pagina(offset + limit) : null,
      previous: offset > 0 ? pagina(Math.max(0, offset - limit)) : null,
      results: POKEMON.slice(offset, offset + limit).map((p) => ({ name: p.name, url: `${base}/api/v2/pokemon/${p.id}/` })),
    });
  }

  if (recurs === "pokemon") {
    const p = PER_ID.get(clau) ?? PER_NOM.get(clau);
    return p ? enviar(res, 200, pokemonComplet(p, base)) : noTrobat(res);
  }

  if (recurs === "type" && !clau) {
    const llista = Object.values(TIPUS).sort((a, b) => a.id - b.id);
    return enviar(res, 200, {
      count: llista.length,
      next: null,
      previous: null,
      results: llista.map((t) => ({ name: t.name, url: `${base}/api/v2/type/${t.id}/` })),
    });
  }

  if (recurs === "type") {
    const t = TIPUS[clau] ?? TIPUS_PER_ID.get(clau);
    if (!t) return noTrobat(res);
    return enviar(res, 200, {
      id: t.id,
      name: t.name,
      pokemon: t.pokemon.map((p) => ({ slot: p.slot, pokemon: { name: p.name, url: `${base}/api/v2/pokemon/${p.id}/` } })),
    });
  }

  noTrobat(res);
});

servidor.on("error", (err) => {
  console.error(err.code === "EADDRINUSE" ? `El port ${PORT} ja està ocupat. Prova: PORT=4000 npm start` : err.message);
  process.exit(1);
});

// 0.0.0.0: accessible també des d'altres ordinadors de l'aula
servidor.listen(PORT, "0.0.0.0", () => {
  console.log(`PokéAPI local amb ${POKEMON.length} Pokémon`);
  console.log(`  En aquest ordinador:  http://localhost:${PORT}/api/v2`);
  for (const xarxa of Object.values(os.networkInterfaces()).flat()) {
    if (xarxa?.family === "IPv4" && !xarxa.internal) {
      console.log(`  Des de l'aula:        http://${xarxa.address}:${PORT}/api/v2`);
    }
  }
});
