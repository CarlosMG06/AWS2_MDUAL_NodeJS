const { performance } = require("node:perf_hooks");

function ocupa(ms) {
  const fi = performance.now() + ms;
  while (performance.now() < fi) {}
}

function batec(cadaMs) {
  let tics = 0;
  let maxSalt = 0;
  // setInterval: tics++ i salt = ara - anterior
  let anterior = performance.now();
  const id = setInterval(() => {
    const ara = performance.now();
    const salt = ara - anterior;
    anterior = ara;
    tics++;
    maxSalt = Math.max(salt, maxSalt);
  }, 0);
  return {
    atura() {
      // clearInterval i el salt de l'últim tic fins ara
      clearInterval(id);
      const ara = performance.now();
      const salt = ara - anterior;
      maxSalt = Math.round(Math.max(salt, maxSalt));
      return { tics, maxSalt };
    },
  };
}
module.exports = { ocupa, batec };