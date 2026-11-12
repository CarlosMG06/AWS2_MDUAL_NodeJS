const args = process.argv.slice(2);

if (!parseInt(args[0])) {
    console.log("Ús: node ampliacio/taula.js <número> [límit]");
    process.exit(1);
}

const n = parseInt(args[0]);
const limit = parseInt(args[1]) ? parseInt(args[1]) : 10;

for (let i = 1; i <= limit; i++) {
    console.log(`${n} x ${i} = ${n*i}`);
}