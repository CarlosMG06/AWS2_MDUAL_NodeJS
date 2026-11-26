import pino from "pino";

// Un sol logger per a tota l'aplicació
export const logger = pino({
  base: { servei: "pokedex-api" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
});
