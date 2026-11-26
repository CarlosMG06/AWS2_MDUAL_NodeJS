import express from "express";
import { registrarPeticions } from "./logs.js";
import { rutesPokemon } from "./rutes/pokemon.js";

export const app = express();

// 1 · Middleware: s'executen per ordre, a cada petició
app.use(registrarPeticions);
// TODO Pas 4: el cos JSON ha d'arribar a req.body

// 2 · Rutes
app.get("/", (req, res) => {
  res.json({
    api: "pokedex-api",
    rutes: [
      "GET /pokemon?limit=&offset=&tipus=",
      "GET /pokemon/:nom",
      "GET /quin-pokemon-ets/:nom",
      "GET /preferits",
      "POST /preferits",
      "DELETE /preferits/:nom",
    ],
  });
});
app.use("/pokemon", rutesPokemon);
// TODO Pas 3: munta rutesQuinEts a /quin-pokemon-ets
// TODO Pas 4: munta rutesPreferits a /preferits

// 3 · Cap ruta ha respost: 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no trobada" });
});

// 4 · Gestor d'errors: 4 paràmetres, sempre l'últim
// A Express 5, un throw o una promesa rebutjada en una ruta async arriben aquí
app.use((err, req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cos ha de ser JSON" });
  }
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err.status === 502 || err.status === 504) {
    req.log.error({ err }, "PokéAPI no respon");
    return res.status(err.status).json({ error: err.message });
  }
  req.log.error({ err }, "error intern");
  res.status(500).json({ error: "Error intern" });
});
