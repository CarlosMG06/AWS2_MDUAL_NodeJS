import { Router } from "express";

export const rutesQuinEts = Router();

// Pokémon de la Pokédex nacional (de l'1 al 1025)
export const TOTAL_POKEMON = 1025;

// Ve fet · el mateix nom dona sempre el mateix número, de l'1 al 1025
export function numeroPerNom(nom) {
  const net = nom
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // "Núria" i "nuria" donen el mateix
  let h = 0;
  for (const c of net) h = (h * 31 + c.codePointAt(0)) % TOTAL_POKEMON;
  return h + 1;
}

// TODO Pas 3: GET /quin-pokemon-ets/:nom
//   400 si el nom no té entre 2 i 30 caràcters
//   200 amb { nom, pokemon, frase: "Alba Sala, ets Pikachu! Tipus electric." }
// Recorda muntar aquest router a app.js
