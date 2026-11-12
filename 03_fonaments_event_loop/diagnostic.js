console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
process.nextTick(() => console.log("D"));
setTimeout(() => {
  console.log("E");
  Promise.resolve().then(() => console.log("F"));
}, 0);
console.log("G");
