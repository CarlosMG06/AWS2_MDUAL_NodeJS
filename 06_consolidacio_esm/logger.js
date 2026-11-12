import pino from "pino";

const logger = pino({
  base: { servei: "inventari-api" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: { level: (etiqueta) => ({ level: etiqueta }) },
});

export { logger };
