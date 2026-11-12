const { sumaFinsA, esParell, estadistiques } = require("./utils");
console.log(sumaFinsA(100));
console.log(esParell(7));

const args = process.argv;
console.log(estadistiques(args.slice(2)));
