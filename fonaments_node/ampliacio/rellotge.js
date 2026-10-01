let ticks = 0;
const id = setInterval(() => {
    const time = new Date().toLocaleTimeString("ca-ES");
    console.log(time);
    ticks++;
    if (ticks >= 5) {
        console.log("Fi");
        clearInterval(id);
    }
}, 1000);

process.on("SIGINT", () => {
    clearInterval(id);
    console.log("\nAdéu! Has aturat el rellotge.");
    process.exit(0);
});