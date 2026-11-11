// Pas 2: una API mínima amb node:http
//   GET /material  GET /material/<codi>   POST /prestecs { "codi": "INV-2026-0004", "persona": "Marta" }
import http from "node:http";
import * as material from "./material.js";

let inventari = material.llegir();

function enviar(res, status, dades) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(dades));
}

function enviarError(res, err) {
  if (err.status)
    return enviar(res, err.status, { error: err.message });
  enviar(res, 500, { error: "Error intern" });
}

function prestec(res, dades) {
  const { codi, persona } = dades;
  const nou = material.prestar(inventari, codi, persona);
  material.desar(nou, (err) => {
    if (err) return enviarError(res, err);
    inventari = nou;
    enviar(res, 201, material.cercar(inventari, codi));
  });
}

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);

  try {
    if (req.method === "GET" && url.pathname === "/material") {
      const estat = url.searchParams.get("estat");
      return enviar(res, 200, estat ? material.filtrar(inventari, estat) : inventari);
    }
    if (req.method === "GET" && parts[0] === "material" && parts.length === 2) {
      const codi = parts[1];
      return enviar(res, 200, material.cercar(inventari, codi));
    }
    if (req.method === "POST" && url.pathname === "/prestecs") {
      let cos = "";
      req.on("data", (tros) => (cos += tros));
      req.on("end", () => {
        let dades;
        try {
          dades = JSON.parse(cos);
        } catch {
          return enviar(res, 400, { error: "El cos ha de ser JSON" });
        }
        try {
          prestec(res, dades);
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

servidor.listen(3000, () => console.log("Model escoltant a http://localhost:3000"));
