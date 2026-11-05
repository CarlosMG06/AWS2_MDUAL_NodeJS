// p2-servidor.js · Model del Pas 2: una API mínima amb node:http
//   GET /aules[?places=30]   GET /aules/<nom>   POST /reserves { "aula": "A12" }
// Prova: node exemples/p2-servidor.js i, al navegador, http://localhost:3001/aules
import http from "node:http";
import { llegirAules, ambCapacitat } from "./p1-modul.js";

const aules = llegirAules();

function enviar(res, status, dades) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(dades));
}

// Amb status: error de la petició. Sense: error nostre (500)
function enviarError(res, err) {
  if (err.status) {
    return enviar(res, err.status, { error: err.message });
  }
  enviar(res, 500, { error: "Error intern" });
}

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  // "/aules/A12" → ["aules", "A12"]
  const parts = url.pathname.split("/").filter(Boolean);

  try {
    if (req.method === "GET" && url.pathname === "/aules") {
      const minim = Number(url.searchParams.get("places") ?? 0);
      return enviar(res, 200, ambCapacitat(aules, minim));
    }
    if (req.method === "GET" && parts[0] === "aules" && parts.length === 2) {
      const aula = aules.find((a) => a.nom === parts[1]);
      if (!aula) {
        return enviar(res, 404, { error: `No existeix l'aula ${parts[1]}` });
      }
      return enviar(res, 200, aula);
    }
    if (req.method === "POST" && url.pathname === "/reserves") {
      // El cos arriba a trossos: es llegeix sencer i es processa al final
      let cos = "";
      req.on("data", (tros) => (cos += tros));
      req.on("end", () => {
        let dades;
        try {
          dades = JSON.parse(cos);
        } catch {
          return enviar(res, 400, { error: "El cos ha de ser JSON" });
        }
        if (!dades.aula) {
          return enviar(res, 400, { error: "Cal l'aula" });
        }
        enviar(res, 201, { aula: dades.aula, reservada: true });
      });
      return;
    }
    enviar(res, 404, { error: "Ruta no trobada" });
  } catch (err) {
    enviarError(res, err);
  }
});

servidor.listen(3001, () => console.log("Model escoltant a http://localhost:3001"));
