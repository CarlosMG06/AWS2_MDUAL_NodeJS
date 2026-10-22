// p4-pino.js · Un logger amb pino: una línia JSON per fet
// Prova: node exemples/p4-pino.js (i amb LOG_LEVEL=debug)
const pino = require("pino");

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { servei: "exemple" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: { level: (etiqueta) => ({ level: etiqueta }) },
});

logger.info("arrencant");
// Primer les dades, després el missatge
logger.info({ elements: 12, aules: 3 }, "inventari carregat");
logger.debug({ fitxer: "data/material.json" }, "lectura feta");
logger.warn({ element: "4d6f" }, "element avariat");

// Un logger fill: totes les seves línies porten reqId
const fill = logger.child({ reqId: "a1b2c3" });
fill.info("petició rebuda");
