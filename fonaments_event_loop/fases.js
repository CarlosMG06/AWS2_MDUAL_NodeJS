const fs = require("node:fs");

setTimeout(() => console.log("principal · timeout"), 0);
setImmediate(() => console.log("principal · immediate"));

fs.readFile(__filename, (err, data) => {
    setTimeout(() => console.log("E/S · timeout"), 0);
    setImmediate(() => console.log("E/S · immediate"));
});