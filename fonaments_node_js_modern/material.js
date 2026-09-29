const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PATH = path.join(__dirname, "data", "material.json");
const TIPUS = ["portatil", "tauleta", "projector", "cable", "altres"];
const ESTATS = ["disponible", "prestat", "avariat"];
const FILTRES = ["tipus", "estat", "aula"];

const llegir = () => JSON.parse(fs.readFileSync(PATH,"utf8"));
const desar = (arr) => fs.writeFileSync(PATH, JSON.stringify(arr, null, 2));

const FORMAT = new Intl.NumberFormat("ca-ES", {
  style: "currency",
  currency: "EUR",
});
const euros = (valor) => FORMAT.format(valor); 
const linia = (elem) => `[${elem.id.slice(0,8)}] ${elem.nom} · ${elem.aula} · ${euros(elem.valor)} · ${elem.estat}`;
const tLC = str => str?.toLowerCase();

function filtrar(arr, filtres = {}) {
    const desconegut = Object.keys(filtres).find(key => !FILTRES.includes(key)); 
    if (desconegut !== undefined) {
        throw new Error(`Filtre desconegut: ${desconegut} (vàlids: ${FILTRES.join(", ")})`);
    }
    return arr.filter(elem =>
        FILTRES.every(f => filtres[f] === undefined || tLC(filtres[f]) === tLC(elem[f]))
    );
}

const cercar = (arr, iniciId) => arr.find(elem => elem.id.startsWith(iniciId));

function crear(nom, tipus, aula, valorStr) {
    if (!nom || !tipus || !aula || !valorStr) {
      throw new Error("Falta alguna dada: nom, tipus, aula, valor")
    }
    if (!arrTipus.includes(tipus)) {
        throw new Error(`Tipus no vàlid: ${tipus} - Vàlids: ${arrTipus.join(", ")}`);
    }
    if (!parseInt(valorStr) || valorStr < 0) {
        throw new Error(`Valor no vàlid: ${valorStr}`);
    }
    const valor = parseInt(valorStr);
    return {
        id: crypto.randomUUID(),
        nom, tipus, aula, valor,
        estat: "disponible",
        dataAlta: new Date().toISOString(),
    };
}

function prestar(arr, iniciId, persona) {
    const elemId = cercar(arr, iniciId);
    if (!elemId) throw new Error(`No s'ha trobat cap element amb id que comenci amb ${iniciId}`);
    if (elemId.estat !== "disponible") {
        const estat = `${elemId.estat} ${elemId.prestatA ? `a ${elemId.prestatA}` : ""}`;
        throw new Error(`No es pot prestar: està ${estat}`);
    }
    return arr.map((elem) =>
      elem.id === elemId.id 
        ? { ...elem, estat: "prestat", prestatA: persona, dataPrestec: new Date().toISOString()} 
        : elem
    );
}

function retornar(arr, iniciId) {
    const elemId = cercar(arr, iniciId);
    if (!elemId) throw new Error(`No s'ha trobat cap element amb id que comenci amb ${iniciId}`);
    if (elemId.estat !== "disponible") {
      throw new Error(`No es pot prestar: està ${elemId.estat}`);
    }
    const {prestatA, dataPrestec, ...resta} = elemId;
    return arr.map((elem) =>
      elem.id === elemId.id 
        ? { ...resta, estat: "disponible"} 
        : elem
    );
}

function estadistiques(arr) {
    const vTotal = arr.reduce((suma, elem) => suma + elem.valor, 0);
    const vMitja = vTotal / arr.length;
    const vMax = arr.reduce((max, elem) => (elem.valor > max.valor ? elem : max));
    const perTipus = arr.reduce((sumes, elem) => {
        if (!sumes[elem.tipus]) sumes[elem.tipus] = 0;
        sumes[elem.tipus]++;
        return sumes;
    }, {});
    const perAulaObjects = Object.groupBy(arr, elem => elem.aula);
    const perAula = Object.keys(perAulaObjects).map(aula => [aula, perAulaObjects[aula].length])
    return {
        elements: arr.length,
        vTotal, 
        perTipus, perAula,
        vMitja, vMax,
    };
}

module.exports = {
    TIPUS, ESTATS, llegir, desar, euros, linia,
    filtrar, cercar, crear, prestar, retornar, estadistiques,
};