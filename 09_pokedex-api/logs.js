import { logger } from "./logger.js";

// Middleware: una línia de log per petició, com a l'activitat 6
export function registrarPeticions(req, res, next) {
  const inici = performance.now();
  // Un logger fill: totes les línies d'aquesta petició porten el mateix reqId
  req.log = logger.child({ reqId: crypto.randomUUID() });

  // finish: la resposta ja ha sortit, i ja sabem l'estat i el temps
  res.on("finish", () => {
    const estat = res.statusCode;
    let nivell = "info";
    if (estat >= 500) nivell = "error";
    else if (estat >= 400) nivell = "warn";
    const ms = Math.round(performance.now() - inici);
    req.log[nivell]({ metode: req.method, ruta: req.originalUrl, estat, ms }, "petició atesa");
  });

  next(); // sense next(), la petició es queda aquí
}
