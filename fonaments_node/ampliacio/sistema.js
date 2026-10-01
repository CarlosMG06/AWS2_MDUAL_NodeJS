const os = require("node:os");

const bytes = os.totalmem();
const gb = (bytes/1024**3).toFixed(1);

console.log(`Sistema: ${os.platform()}`);
console.log(`Màquina: ${os.hostname()}`);
console.log(`CPU: ${os.cpus().length} nuclis lògics`);
console.log(`Memòria: ${gb} GB`);
console.log(`Node: ${process.version}`);
console.log(`Carpeta: ${process.cwd()}`);
console.log(`Encès des de fa ${Math.round(os.uptime()/60)} minuts`);

// Extra
console.table({
    sistema: os.platform(),
    maquina: os.hostname(),
    cpu: os.cpus().length,
    memoriaGB: gb,
    node: process.version,
    carpeta: process.cwd(),
    uptimeSec: os.uptime(),
});
