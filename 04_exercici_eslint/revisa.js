const fs = require("node:fs");

function mitjana(numeros) {
  let suma = 0;
  for (const n of numeros) suma += n;
  return suma / numeros.length;
}

function llegir(ruta) {
  try {
    return JSON.parse(fs.readFileSync(ruta, "utf8"));
  } catch {
    throw new Error("No es pot llegir " + ruta);
  }
}

function estat(element) {
  if (element.estat === "prestat") {
    console.log("Prestat a", element.prestatA);
    return "No disponible";
  }
  return "Disponible";
}

const element = { nom: "HP 14", valor: 450 };
const { ...resta } = element;

console.log(mitjana([4, 8]), llegir, estat(element), resta);
