setTimeout(() => console.log("1"), 0);
setTimeout(() => {
  console.log("2");
  process.nextTick(() => console.log("3"));
}, 0);
setTimeout(() => console.log("4"), 0);
Promise.resolve().then(() => setTimeout(() => console.log("5"), 0));