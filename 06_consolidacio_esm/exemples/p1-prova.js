// p1-prova.js · Importa del mòdul: en ES Modules l'extensió .js és obligatòria
import { llegirAules, ambCapacitat } from "./p1-modul.js";

const aules = llegirAules();
const grans = ambCapacitat(aules, 30).map((a) => a.nom);
console.log(`Aules amb 30 places o més: ${grans.join(", ")}`);
