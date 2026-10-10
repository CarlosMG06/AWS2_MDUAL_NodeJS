const http = require("node:http");
const { ocupa } = require("./mesura");
 
const servidor = http.createServer((req, res) => {
  const time = new Date().toLocaleTimeString("ca-ES");
  console.log(`${time} · ${req.method} ${req.url}`);
  switch (req.url) {
    case "/":       return res.end("Hola!\n");
    case "/lent":   return ocupa(5000);
    case "/espera": return setTimeout(() => res.end("S'agraeix l'espera!"), 5000);
    default:
      res.statusCode = 404;
      res.end("No trobat\n");
      break;
  }
});

servidor.listen(3000, () => console.log(
  "Servidor a http://localhost:3000 (Ctrl+C per aturar)"
));
