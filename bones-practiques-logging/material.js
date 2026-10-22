// material.js · La lògica de l'inventari, compartida per importa.js i servidor.js
// Ve fet: en aquesta activitat no cal modificar-lo.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const RUTA = path.join(__dirname, "data", "material.json");
const TIPUS = ["portatil", "tauleta", "projector", "cable", "altres"];

// Un error causat per les dades que envia qui fa la petició.
// status és el codi HTTP que li correspon: 400, 404, 409...
function errorClient(missatge, status) {
  const err = new Error(missatge);
  err.status = status;
  return err;
}

// Llegeix l'inventari. Fa servir *Sync: només s'ha de cridar a l'arrencada o en un script.
function llegir() {
  let text;
  try {
    text = fs.readFileSync(RUTA, "utf8");
  } catch (err) {
    throw new Error("No existeix data/material.json: executa npm run reset", { cause: err });
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("data/material.json no és JSON vàlid: executa npm run reset", { cause: err });
  }
}

// Desa l'inventari de manera síncrona (per a scripts)
const desar = (llista) => fs.writeFileSync(RUTA, JSON.stringify(llista, null, 2) + "\n");

// Desa l'inventari sense bloquejar el fil (per al servidor)
const desarAsync = (llista, callback) =>
  fs.writeFile(RUTA, JSON.stringify(llista, null, 2) + "\n", callback);

function crear({ nom, tipus, aula, valor }) {
  if (!nom || !aula) throw errorClient("Falten dades: cal nom i aula", 400);
  if (!TIPUS.includes(tipus)) {
    throw errorClient(`Tipus no vàlid: ${tipus} (vàlids: ${TIPUS.join(", ")})`, 400);
  }
  const text = String(valor ?? "").trim();
  const numero = Number(text);
  if (text === "" || !Number.isFinite(numero) || numero < 0) {
    throw errorClient(`Valor no vàlid: "${valor ?? ""}"`, 400);
  }
  return {
    id: crypto.randomUUID(),
    nom,
    tipus,
    aula,
    valor: numero,
    estat: "disponible",
    dataAlta: new Date().toISOString(),
  };
}

function cercar(llista, prefix) {
  if (!prefix) throw errorClient("Cal indicar l'inici de l'id", 400);
  const trobats = llista.filter((m) => m.id.startsWith(prefix));
  if (trobats.length > 1) {
    throw errorClient(`Prefix ambigu: ${prefix} coincideix amb ${trobats.length} elements`, 400);
  }
  if (trobats.length === 0) throw errorClient(`No he trobat cap element amb l'id ${prefix}`, 404);
  return trobats[0];
}

// Retorna una llista nova amb l'element prestat; l'original no canvia
function prestar(llista, prefix, persona) {
  const element = cercar(llista, prefix);
  if (!persona) throw errorClient("Cal indicar a qui es presta", 400);
  if (element.estat !== "disponible") {
    throw errorClient(`No es pot prestar: està ${element.estat}`, 409);
  }
  const prestat = {
    ...element,
    estat: "prestat",
    prestatA: persona,
    dataPrestec: new Date().toISOString(),
  };
  return llista.map((m) => (m.id === element.id ? prestat : m));
}

module.exports = { TIPUS, llegir, desar, desarAsync, crear, cercar, prestar };
