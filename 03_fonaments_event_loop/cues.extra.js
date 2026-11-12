// Extra: canviar nextTick per queueMicrotask
setTimeout(() => console.log("loop"), 0);
Promise.resolve().then(() => console.log("l'event"));
queueMicrotask(() => console.log("des de"));
console.log("Hola");

// Surt "Hola l'event des de loop"
// Perquè queueMicroTask va a la cua de les promeses