import pino from "pino";

// Un sol logger per a tot el servidor. LOG_LEVEL permet canviar el nivell sense tocar el codi
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { servei: "temps-api" },
});
