// p1-modul.js · Model del Pas 1: un mòdul en ES Modules
// Prova: node exemples/p1-prova.js
import fs from "node:fs";
import path from "node:path";

// En ES Modules no hi ha __dirname: es fa servir import.meta.dirname
const RUTA = path.join(import.meta.dirname, "aules.json");

// export davant de la declaració: no cal cap module.exports al final
export function llegirAules() {
  return JSON.parse(fs.readFileSync(RUTA, "utf8"));
}

export function ambCapacitat(aules, minim) {
  if (minim < 0) {
    const err = new Error("El mínim de places no pot ser negatiu");
    err.status = 400;
    throw err;
  }
  return aules.filter((a) => a.places >= minim);
}
