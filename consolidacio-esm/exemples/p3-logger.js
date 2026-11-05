// p3-logger.js · Model del Pas 3: una línia de log per petició, amb id, estat i durada
// Prova: node exemples/p3-logger.js (fa tres peticions i acaba)
import http from "node:http";
import crypto from "node:crypto";
import pino from "pino";

const logger = pino({
  base: { servei: "model" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: { level: (etiqueta) => ({ level: etiqueta }) },
});

const servidor = http.createServer((req, res) => {
  const inici = performance.now();
  // Un logger fill: totes les línies porten el mateix reqId
  req.log = logger.child({ reqId: crypto.randomUUID() });

  // finish: la resposta ja ha sortit, i ja sabem l'estat i el temps
  res.on("finish", () => {
    const estat = res.statusCode;
    let nivell = "info";
    if (estat >= 500) nivell = "error";
    else if (estat >= 400) nivell = "warn";
    const ms = Math.round(performance.now() - inici);
    const dades = { metode: req.method, ruta: req.url, estat, ms };
    req.log[nivell](dades, "petició atesa");
  });

  if (req.url === "/peta") {
    try {
      JSON.parse("{ trencat");
    } catch (err) {
      // L'objecte a la clau err: tipus, missatge i pila
      req.log.error({ err }, "error inesperat");
      res.writeHead(500);
      return res.end();
    }
  }
  res.writeHead(req.url === "/" ? 200 : 404);
  res.end();
});

servidor.listen(3002);
for (const ruta of ["/", "/no-hi-es", "/peta"]) {
  await fetch(`http://localhost:3002${ruta}`);
}
servidor.close();
