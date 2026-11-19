import http from "node:http";
import crypto from "node:crypto";
import { logger } from "./logger.js";
import { tempsDe, comparar } from "./meteo.js";

const PORT = Number(process.env.PORT ?? 3000);

function enviar(res, status, dades) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(dades));
}

const servidor = http.createServer(async (req, res) => {
  const inici = performance.now();
  // Un logger fill: totes les línies d'aquesta petició porten el mateix reqId
  req.log = logger.child({ reqId: crypto.randomUUID() });

  // Una línia per petició, quan la resposta ja ha sortit
  res.on("finish", () => {
    const estat = res.statusCode;
    let nivell = "info";
    if (estat >= 500) nivell = "error";
    else if (estat >= 400) nivell = "warn";
    const ms = Math.round(performance.now() - inici);
    req.log[nivell]({ metode: req.method, ruta: req.url, estat, ms }, "petició atesa");
  });

  try {
    const url = new URL(req.url, "http://localhost");
    const parts = url.pathname.split("/").filter(Boolean);

    // GET /temps/<ciutat>
    if (req.method === "GET" && parts[0] === "temps" && parts.length === 2) {
      const ciutat = decodeURIComponent(parts[1]);
      return enviar(res, 200, await tempsDe(ciutat));
    }

    // GET /compara?ciutats=Barcelona,Girona
    if (req.method === "GET" && url.pathname === "/compara") {
      const ciutats = (url.searchParams.get("ciutats") ?? "")
        .split(",")
        .map((nom) => nom.trim())
        .filter(Boolean);
      return enviar(res, 200, comparar(ciutats));
    }

    enviar(res, 404, { error: "Ruta no trobada" });
  } catch (err) {
    // Errors previstos: meteo.js hi posa l'estat que toca (400, 404 o 502)
    if (err.status) {
      if (err.status >= 500) req.log.error({ err }, "ha fallat Open-Meteo");
      return enviar(res, err.status, { error: err.message });
    }
    // Un %zz a la ruta fa fallar decodeURIComponent: la petició està mal feta
    if (err instanceof URIError) {
      return enviar(res, 400, { error: "La ruta no està ben codificada" });
    }
    // No sabem què ha passat: al log amb tot el detall, al client només el mínim
    req.log.error({ err }, "error no previst");
    enviar(res, 500, { error: "Error intern" });
  }
});

servidor.listen(PORT, () => {
  logger.info({ port: PORT }, "servidor en marxa");
});
