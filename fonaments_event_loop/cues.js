// I finalment microtasques com els temporitzadors
setTimeout(() => console.log("loop"), 0);
// Aleshores les promeses
Promise.resolve().then(() => console.log("l'event"));
// Després nextTick
process.nextTick(() => console.log("des de"));
// Primer surt el codi síncron
console.log("Hola");