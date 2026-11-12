// material.js
import fs from "node:fs";
import path from "node:path";

const RUTA = path.join(import.meta.dirname, "data", "material.json");
const ESTATS = ["disponible", "prestat", "avariat"];

// Un error amb status: l'API el convertirà en la resposta que toca
function error(status, missatge) {
  const err = new Error(missatge);
  err.status = status;
  return err;
}

// A l'arrencada, llegir amb *Sync és correcte
function llegir() {
  return JSON.parse(fs.readFileSync(RUTA, "utf8"));
}

// Dins del servidor no es bloqueja: el resultat arriba al callback
function desar(llista, callback) {
  fs.writeFile(RUTA, JSON.stringify(llista, null, 2), callback);
}

function filtrar(llista, estat) {
  if (estat === undefined || estat === null) return llista;
  if (!ESTATS.includes(estat)) {
    throw error(400, `Estat no vàlid: ${estat} (vàlids: ${ESTATS.join(", ")})`);
  }
  return llista.filter((m) => m.estat === estat);
}

function cercar(llista, codi) {
  const element = llista.find((m) => m.codi === codi);
  if (!element) throw error(404, `No hi ha cap element amb el codi ${codi}`);
  return element;
}

function prestar(llista, codi, persona) {
  if (typeof persona !== "string" || !persona.trim()) {
    throw error(400, "Cal el nom de la persona");
  }
  const element = cercar(llista, codi);
  if (element.estat !== "disponible") {
    throw error(409, `No es pot prestar: està ${element.estat}`);
  }
  const prestat = { estat: "prestat", prestatA: persona.trim(), dataPrestec: new Date().toISOString() };
  return llista.map((m) => (m.codi === codi ? { ...m, ...prestat } : m));
}

function retornar(llista, codi) {
  const element = cercar(llista, codi);
  if (element.estat !== "prestat") {
    throw error(409, `No es pot retornar: està ${element.estat}`);
  }
  const { prestatA, dataPrestec, ...resta } = element;
  return llista.map((m) => (m.codi === codi ? { ...resta, estat: "disponible" } : m));
}

export { ESTATS, llegir, desar, filtrar, cercar, prestar, retornar };
