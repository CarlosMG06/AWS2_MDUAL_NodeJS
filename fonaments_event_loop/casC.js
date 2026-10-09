setTimeout(() => console.log("1"), 10);
setTimeout(() => console.log("2"), 0);
const inici = Date.now();
while (Date.now() - inici < 50) {}
console.log("3");