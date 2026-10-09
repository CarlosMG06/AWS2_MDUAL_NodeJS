const readline = require("node:readline");
const rl = readline.createInterface(process.stdin,process.stdout);

const nRand = Math.floor(Math.random() * 100) + 1;
let intents = 0;

function pregunta() {
    rl.question("Endevina el número (1-100): ", (answer) => {
        const n = parseInt(answer);
        if (!n || n < 1 || n > 100) {
            console.log("Escriu un número entre 1 i 100");
            return pregunta();
        }
        intents++;
        if (n < nRand) { 
            console.log("Més alt"); 
            pregunta(); 
        } else if (n > nRand) {
            console.log("Més baix");
            pregunta();
        } else {
            console.log(`Correcte! Ho has fet en ${intents} intents`);
            rl.close();
        }
    })
}
pregunta();
