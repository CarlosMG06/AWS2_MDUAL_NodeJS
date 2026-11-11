// Pas 2: una API mínima amb node:http
//   GET /material  GET /material/<codi>   POST /prestecs { "codi": "INV-2026-0004", "persona": "Marta" }
import http from "node:http";
import crypto from "node:crypto";
import * as material from "./material.js";
import { logger } from "./logger.js";

const PORT = 3000;
let inventari = material.llegir();

function enviar(res, status, dades) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(dades));
}

function enviarError(req, res, err) {
  if (err.status) {
    enviar(res, err.status, { error: err.message });
  } else {
    // L'objecte a la clau err: tipus, missatge i pila
    req.log.error({ err }, "error inesperat");
    enviar(res, 500, { error: "Error intern" });
  }
}

function prestec(req, res, dades) {
  const { codi, persona } = dades;
  const nou = material.prestar(inventari, codi, persona);
  material.desar(nou, (err) => {
    if (err) return enviarError(req, res, err);
    logger.info({ codi: codi }, "préstec registrat");
    inventari = nou;
    enviar(res, 201, material.cercar(inventari, codi));
  });
}

const servidor = http.createServer((req, res) => {
  const inici = performance.now();

  const url = new URL(req.url, "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);
  // Un logger fill: totes les línies porten el mateix reqId
  req.log = logger.child({ reqId: crypto.randomUUID() });

  // finish: la resposta ja ha sortit, i ja sabem l'estat i el temps
  res.on("finish", () => {
    const ms = Math.round(performance.now() - inici);
    const estat = res.statusCode;
    const nivell = estat >= 500 ? "error" : estat >= 400 ? "warn" : "info";
    const dades = { metode: req.method, ruta: req.url, estat, ms };
    req.log[nivell](dades, "petició atesa");
  });

  try {
    if (req.method === "GET" && url.pathname === "/material") {
      const estat = url.searchParams.get("estat");
      return enviar(res, 200, estat ? material.filtrar(inventari, estat) : inventari);
    }
    if (req.method === "GET" && parts[0] === "material" && parts.length === 2) {
      const codi = parts[1];
      return enviar(res, 200, material.cercar(inventari, codi));
    }
    if (req.method === "POST" && url.pathname === "/prestecs") {
      let cos = "";
      req.on("data", (tros) => (cos += tros));
      req.on("end", () => {
        let dades;
        try {
          dades = JSON.parse(cos);
        } catch {
          return enviar(res, 400, { error: "El cos ha de ser JSON" });
        }
        try {
          prestec(req, res, dades);
        } catch (err) {
          enviarError(req, res, err);
        }
      });
      return;
    }
    enviar(res, 404, { error: "Ruta no trobada" });
  } catch (err) {
    enviarError(req, res, err);
  }
});

servidor.listen(PORT, () => logger.info({ port: PORT }, "servidor en marxa"));
