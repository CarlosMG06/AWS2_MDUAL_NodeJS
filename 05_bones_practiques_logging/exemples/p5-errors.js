// p5-errors.js · Com es registra un error
// Prova: node exemples/p5-errors.js
const pino = require("pino");

const logger = pino({
  base: { servei: "exemple" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: { level: (etiqueta) => ({ level: etiqueta }) },
});

try {
  JSON.parse("{ trencat");
} catch (err) {
  // Malament: només el text, sense tipus ni pila
  logger.error("Error: " + err.message);
  // Bé: l'objecte a la clau err (tipus, missatge i pila)
  logger.error({ err }, "no es pot llegir la configuració");
}
