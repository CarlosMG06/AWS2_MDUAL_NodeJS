const fs = require("node:fs");
const { disponibles, valorTotal } = require("./material");

console.log("A · Inici");
fs.readFile("data/material.json", "utf8", (err, text) => {
    if (err) return console.error("No trobo material.json");
    // --- Apartat 1.d
    try {
        const llista = JSON.parse(text);
        console.log(`B · Disponibles: ${disponibles(llista).length}`);
        console.log(`C · Valor: ${valorTotal(llista)} €`);
    } catch (error) {
        return console.error("material.json no és JSON vàlid");
    }
    // ---
});
process.nextTick(() => console.log("D · nextTick"));
console.log("E · Fi");
