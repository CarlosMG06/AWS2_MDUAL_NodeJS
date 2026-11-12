import fs from "node:fs";
import path from "node:path";

const DIR = import.meta.dirname;
const PATH = path.join(DIR, "data", "material.json");
const FILTRES = ["tipus", "estat", "aula"];

const tLC = str => str?.toLowerCase();

export const llegir = () => JSON.parse(fs.readFileSync(PATH, "utf8"));
export const filtrar = (arr, filtres = {}) => {
    const desconegut = Object.keys(filtres).find(key => !FILTRES.includes(key)); 
    if (desconegut !== undefined) {
        throw new Error(`Filtre desconegut: ${desconegut} (vàlids: ${FILTRES.join(", ")})`);
    }
    return arr.filter(elem =>
        FILTRES.every(f => filtres[f] === undefined || tLC(filtres[f]) === tLC(elem[f]))
    );
};
