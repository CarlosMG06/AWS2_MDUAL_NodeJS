const op = require("./operacions.js");

const args = process.argv.slice(2);
if (args.length < 3) {
    console.log("Ús: node ampliacio/calc.js <n1> <operador> <n2>");
    process.exit(1);
}

const n1 = Number(args[0]);
const operador = args[1];
const n2 = Number(args[2]);

try {
    switch (operador) {
        case "+": console.log(op.suma(n1,n2)); break;
        case "-": console.log(op.resta(n1,n2)); break;
        case "x": console.log(op.multiplica(n1,n2)); break;
        case "/": console.log(op.divideix(n1,n2)); break;
        default:
            console.log(`Operador desconegut: ${operador}`)
            break;
    }
} catch (e) {
    console.log("Error:", e.message);
}
