const fs = require("node:fs");
fs.readFile("gran.txt", (err, dades) => {
  if (err) return console.error(err.message);
  console.log(`Llegits ${dades.length} bytes`);
});
console.log("Fet"); // surt primer!
