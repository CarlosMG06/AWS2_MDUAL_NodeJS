// prova-material.js · Comprova el Pas 1 (ve fet): node prova-material.js
import { ESTATS, llegir, filtrar, cercar } from "./material.js";

const llista = llegir();
console.log(`Elements: ${llista.length}`);
for (const estat of ESTATS) {
  console.log(`  ${estat}: ${filtrar(llista, estat).length}`);
}
console.log(`INV-2026-0001: ${cercar(llista, "INV-2026-0001").nom}`);
