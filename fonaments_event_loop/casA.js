process.nextTick(() => console.log("1"));
Promise.resolve().then(() => console.log("2"));
process.nextTick(() => {
  console.log("3");
  process.nextTick(() => console.log("4"));
});