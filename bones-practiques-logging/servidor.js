// servidor.js · API de l'inventari de l'aula
// GET /material[?estat=...]   GET /material/<id>   POST /prestecs
const http = require("node:http");
const material = require("./material");

const PORT = Number(process.env.PORT ?? 3000);
const TOKEN = process.env.TOKEN ?? "aula-2026";

// A l'arrencada es pot llegir amb *Sync: encara no hi ha cap petició esperant
let inventari = material.llegir();

function enviar(res, status, dades) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(dades));
}

// Els errors amb status són culpa de la petició (400, 404, 409...); la resta, un error nostre
function enviarError(res, err) {
  if (err.status) {
    enviar(res, err.status, { error: err.message });
  } else {
    console.log("error");
    enviar(res, 500, { error: "Error intern" });
  }
}

function prestec(req, res, cos) {
  if (req.headers.authorization !== `Bearer ${TOKEN}`) {
    return enviar(res, 401, { error: "Cal un token vàlid" });
  }
  const { id, persona } = JSON.parse(cos);
  console.log("Préstec:", id, persona);
  // Només es presta a correus del centre
  if (!persona.email.endsWith("@institut.cat")) {
    return enviar(res, 403, { error: "Només per a correus del centre" });
  }
  const nou = material.prestar(inventari, id, persona.nom);
  material.desarAsync(nou, (err) => {
    if (err) return enviarError(res, err);
    inventari = nou;
    enviar(res, 201, material.cercar(inventari, id));
  });
}

const servidor = http.createServer((req, res) => {
  console.log(new Date().toLocaleString() + " " + req.method + " " + req.url + " " + JSON.stringify(req.headers));
  const url = new URL(req.url, "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);

  try {
    if (req.method === "GET" && url.pathname === "/material") {
      const estat = url.searchParams.get("estat");
      return enviar(res, 200, estat ? inventari.filter((m) => m.estat === estat) : inventari);
    }
    if (req.method === "GET" && parts[0] === "material" && parts.length === 2) {
      return enviar(res, 200, material.cercar(inventari, parts[1]));
    }
    if (req.method === "POST" && url.pathname === "/prestecs") {
      let cos = "";
      req.on("data", (tros) => (cos += tros));
      req.on("end", () => {
        try {
          prestec(req, res, cos);
        } catch (err) {
          enviarError(res, err);
        }
      });
      return;
    }
    enviar(res, 404, { error: "Ruta no trobada" });
  } catch (err) {
    enviarError(res, err);
  }
});

servidor.listen(PORT, () => console.log("Servidor en marxa"));
