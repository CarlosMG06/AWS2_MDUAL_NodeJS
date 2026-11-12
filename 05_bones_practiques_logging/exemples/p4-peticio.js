// p4-peticio.js · Un log per petició, amb id i durada
// Prova: node exemples/p4-peticio.js (fa dues peticions i acaba)
const http = require("node:http");
const crypto = require("node:crypto");
const pino = require("pino");

const logger = pino({
  base: { servei: "exemple" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: { level: (etiqueta) => ({ level: etiqueta }) },
});

const servidor = http.createServer((req, res) => {
  const inici = performance.now();
  req.id = req.headers["x-request-id"] ?? crypto.randomUUID();
  req.log = logger.child({ reqId: req.id });
  res.setHeader("X-Request-Id", req.id);

  // finish: la resposta ja ha sortit; sabem l'estat i el temps
  res.on("finish", () => {
    const ms = Math.round(performance.now() - inici);
    const estat = res.statusCode;
    const nivell = estat >= 400 ? "warn" : "info";
    const dades = { metode: req.method, ruta: req.url, estat, ms };
    req.log[nivell](dades, "petició atesa");
  });

  res.writeHead(req.url === "/" ? 200 : 404);
  res.end();
});

servidor.listen(3001, () => {
  http.get("http://localhost:3001/", (r1) => {
    r1.resume();
    http.get("http://localhost:3001/no-hi-es", (r2) => {
      r2.resume();
      servidor.close();
    });
  });
});
