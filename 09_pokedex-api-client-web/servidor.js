// Servidor del client web. Fa dues coses:
//   1. Serveix els fitxers de public/ (HTML, CSS i JS).
//   2. Fa de proxy: tot el que arriba a /api/... ho reenvia a l'API de l'activitat 9.
// Així el navegador només parla amb un origen (localhost:5173) i no cal CORS a l'API.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const PORT = Number(process.env.PORT ?? 5173);
const API_URL = process.env.API_URL ?? "http://localhost:3000";
const PUBLIC = path.join(import.meta.dirname, "public");

const TIPUS_MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function enviarJson(res, status, dades) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(dades));
}

// Llegeix el cos de la petició (per als POST)
async function llegirCos(req) {
  const trossos = [];
  for await (const tros of req) trossos.push(tros);
  return Buffer.concat(trossos);
}

// ---------- 1. Proxy: /api/pokemon/25 → http://localhost:3000/pokemon/25
async function reenviar(req, res) {
  const desti = API_URL + req.url.slice("/api".length);
  const opcions = { method: req.method, signal: AbortSignal.timeout(10_000) };
  if (req.headers["content-type"]) opcions.headers = { "Content-Type": req.headers["content-type"] };
  if (req.method !== "GET" && req.method !== "HEAD") opcions.body = await llegirCos(req);

  let resposta;
  try {
    resposta = await fetch(desti, opcions);
  } catch (err) {
    const motiu = err.name === "TimeoutError" ? "no respon" : (err.cause?.code ?? err.message);
    console.error(`API no disponible a ${API_URL}: ${motiu}`);
    return enviarJson(res, 502, { error: `No es pot connectar amb l'API (${API_URL}): ${motiu}` });
  }

  const capcaleres = {};
  const tipus = resposta.headers.get("content-type");
  if (tipus) capcaleres["Content-Type"] = tipus;
  res.writeHead(resposta.status, capcaleres);
  res.end(Buffer.from(await resposta.arrayBuffer()));
}

// ---------- 2. Fitxers estàtics de public/
async function servirFitxer(req, res) {
  const { pathname } = new URL(req.url, "http://localhost");
  const relatiu = pathname === "/" ? "index.html" : decodeURIComponent(pathname).slice(1);
  const fitxer = path.join(PUBLIC, relatiu);

  // Seguretat: no deixem sortir de public/ amb rutes com /../servidor.js
  if (!fitxer.startsWith(PUBLIC + path.sep)) return enviarJson(res, 403, { error: "Prohibit" });

  try {
    const contingut = await fs.readFile(fitxer);
    res.writeHead(200, { "Content-Type": TIPUS_MIME[path.extname(fitxer)] ?? "application/octet-stream" });
    res.end(contingut);
  } catch {
    enviarJson(res, 404, { error: "Fitxer no trobat" });
  }
}

const servidor = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);
  try {
    if (req.url === "/api" || req.url.startsWith("/api/")) return await reenviar(req, res);
    if (req.method !== "GET") return enviarJson(res, 405, { error: "Mètode no permès" });
    await servirFitxer(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) enviarJson(res, 500, { error: "Error intern del client web" });
  }
});

servidor.on("error", (err) => {
  console.error(err.code === "EADDRINUSE" ? `El port ${PORT} ja està ocupat` : err.message);
  process.exit(1);
});

servidor.listen(PORT, () => {
  console.log(`Client web a http://localhost:${PORT}`);
  console.log(`Les peticions a /api van a ${API_URL}`);
});
