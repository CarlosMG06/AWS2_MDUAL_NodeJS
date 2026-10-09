const crypto = require("node:crypto");

const fils = process.env.UV_THREADPOOL_SIZE;
console.log(`Fils del pool: ${fils ?? "4 (per defecte)"}`);

const inici = Date.now();
for (let i = 0; i < 6; i++) {
    crypto.pbkdf2Sync('password', 'salt', 200_000, 64, 'sha512');
    const ara = Date.now();
    console.log(`Tasca ${i} · ${ara - inici} ms`);
}
console.log("Totes les tasques enviades: el fil principal ja està lliure");