const { performance } = require("node:perf_hooks");
 
function ocupa(ms) {
  const fi = performance.now() + ms;
  while (performance.now() < fi) {}
}

let ticks = 0;
let ms = null;
const diffs = [];

const inici = Math.round(performance.now());

const id = setInterval(() => {
    const msPrev = ms ?? inici;
    ms = Math.round(performance.now());
    diffs.push(ms - msPrev);
    ticks++;
    console.log(`tic ${ticks} · ${ms} ms`);
    if (ticks >= 8) {
        clearInterval(id);
        const diffMax = Math.max(...diffs);
        console.log(`Salt més gran entre tics: ${diffMax} ms`)
    }
}, 200);

setTimeout(() => {
    console.log("Comença la feina pesada (2 s)...");
    ocupa(2000);
    console.log("Feina feta");
}, 900);
