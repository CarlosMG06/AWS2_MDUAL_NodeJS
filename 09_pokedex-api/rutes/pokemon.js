import { Router } from "express";
import { error } from "../errors.js";
import { llistar } from "../pokeapi.js";

export const rutesPokemon = Router();

// Llegeix un enter de req.query; si no hi és, el valor per defecte
function llegirEnter(valor, perDefecte, min, max, nom) {
  if (valor === undefined) return perDefecte;
  const n = Number(valor);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw error(400, `${nom} ha de ser un enter entre ${min} i ${max}`);
  }
  return n;
}

// GET /pokemon?limit=20&offset=0 · ve fet
rutesPokemon.get("/", async (req, res) => {
  const limit = llegirEnter(req.query.limit, 20, 1, 50, "limit");
  const offset = llegirEnter(req.query.offset, 0, 0, 100000, "offset");

  // TODO Pas 2: si arriba ?tipus=fire, respon amb
  //   { tipus, total, limit, offset, resultats } només amb els d'aquest tipus

  const { total, resultats } = await llistar(limit, offset);
  res.json({ total, limit, offset, resultats });
});

// TODO Pas 1: GET /pokemon/:nom (pikachu, Pikachu o 25) → el Pokémon simplificat
