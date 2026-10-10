const { performance } = require("node:perf_hooks");
const { batec } = require("./mesura");
 
function esPrimer(n) {
    for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) return false;
    }
    return true;
}

function comptaPrimers(des, fins) {
    let primers = 0;
    for (let i = des; i <= fins; i++) {
        if (esPrimer(i)) primers++;
    }
    return primers;
}

const FINS = 5_000_000;
const TROS = 50_000;

// Versió 1
const b = batec(10);
const inici = performance.now();

const primers = comptaPrimers(0, FINS);

const { tics, maxSalt } = b.atura();
const ms = Math.round(performance.now() - inici);
console.log(`D'un cop:  ${primers} primers en ${ms} ms · tics: ${tics} · salt màxim ${maxSalt}`);

// Versió 2
let des = 0;
let total = 0;

const b2 = batec(10);
const inici2 = performance.now();

function tros() {
    const fins = Math.min(des + TROS, FINS);
    total += comptaPrimers(des, fins);
    des = fins;
    if (des < FINS) setImmediate(tros);
    else {
        const { tics, maxSalt } = b2.atura();
        const ms2 = Math.round(performance.now() - inici2);
        console.log(`A trossos: ${total} primers en ${ms2} ms · tics: ${tics} · salt màxim ${maxSalt}`);
    };
}

tros();
