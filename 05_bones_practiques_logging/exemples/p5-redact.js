// p5-redact.js · Dades que no han de sortir mai al log
// Prova: node exemples/p5-redact.js
const pino = require("pino");

const logger = pino({
  base: { servei: "exemple" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: { level: (etiqueta) => ({ level: etiqueta }) },
  // Camps que surten com a [Redacted]. * vol dir «qualsevol clau»
  redact: ["persona.email", "*.authorization", "token"],
});

const persona = { nom: "Marta", email: "marta@institut.cat" };
logger.info({ persona }, "préstec");
const capcaleres = { authorization: "Bearer aula-2026" };
logger.info({ capcaleres }, "petició");
logger.info({ token: "aula-2026" }, "configuració carregada");
