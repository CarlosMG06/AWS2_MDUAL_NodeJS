const pino = require("pino");

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { servei: "inventari" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: { level: (etiqueta) => ({ level: etiqueta }) },
  redact: ["persona.email", "*.authorization", "token"],
});

module.exports = { logger };
