import { app } from "./app.js";
import { logger } from "./logger.js";
import { BASE } from "./pokeapi.js";

const PORT = Number(process.env.PORT ?? 3000);

// A Express 5, si el port està ocupat, l'error arriba al callback
app.listen(PORT, (err) => {
  if (err) {
    logger.error({ err }, "no s'ha pogut engegar el servidor");
    process.exit(1);
  }
  logger.info({ port: PORT, pokeapi: BASE }, "servidor en marxa");
});
