const { performance } = require("node:perf_hooks");
const { ocupa } = require("./mesura.js");

let ticks = 0;
let maxSalt = 0;
let anterior = Math.round(performance.now());

const id = setInterval(() => {
    const ara = Math.round(performance.now());
    const salt = ara - anterior;
    anterior = ara;
    ticks++;
    maxSalt = Math.max(salt, maxSalt);
    console.log(`tic ${ticks} · ${ara} ms`);
    if (ticks >= 8) {
        clearInterval(id);
        console.log(`Salt més gran entre tics: ${maxSalt} ms`)
    }
}, 200);

setTimeout(() => {
    console.log("Comença la feina pesada (2 s)...");
    ocupa(2000);
    console.log("Feina feta");
}, 900);
