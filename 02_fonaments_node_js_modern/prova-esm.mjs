import { llegir, filtrar } from "./material.mjs";

const dades = llegir();

console.log(`Tauletes: ${filtrar(dades, {tipus: "tauleta"}).length}`);
console.log(`Disponibles: ${filtrar(dades, {estat: "disponible"}).length}`);
console.log(`Dins de la bibilioteca: ${filtrar(dades, {aula: "Biblioteca"}).length}`);