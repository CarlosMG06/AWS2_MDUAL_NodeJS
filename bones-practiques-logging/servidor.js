// servidor.js · API de l'inventari de l'aula
// GET /material[?estat=...]   GET /material/<id>   POST /prestecs
const http = require("node:http");
const material = require("./material");
const { logger } = require("./logger");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT ?? 3000);
const TOKEN = process.env.TOKEN;

function crearServidor(opcions = {}) {
  const token = opcions.token ?? TOKEN;
  if (!token) throw new Error("Cal definir TOKEN abans d'engegar el servidor");
  let inventari = opcions.inventari ?? material.llegir();
  const desarAsync = opcions.desarAsync ?? material.desarAsync;
  let cuaPrestecs = Promise.resolve();

  function enviar(res, status, dades) {
    res.statusCode = status;
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ estat: status, ...dades }));
  }

  function enviarError(req, res, err) {
    if (res.writableEnded) return;
    if (err.status) {
      enviar(res, err.status, { error: err.message });
    } else {
      req.log.error({ err }, "error inesperat");
      enviar(res, 500, { error: "Error intern", ref: req.id });
    }
  }

  async function prestec(req, res, cos) {
    if (req.headers.authorization !== `Bearer ${token}`) {
      return enviar(res, 401, { error: "Cal un token vàlid" });
    }
    let dades;
    try {
      dades = JSON.parse(cos);
    } catch {
      const err = new Error("El cos ha de ser JSON vàlid");
      err.status = 400;
      throw err;
    }
    if (!dades || typeof dades !== "object" || Array.isArray(dades)) {
      const err = new Error("El cos ha de ser un objecte JSON");
      err.status = 400;
      throw err;
    }
    const { id, persona } = dades;
    if (typeof id !== "string" || !id.trim() || !persona || typeof persona !== "object" || Array.isArray(persona)) {
      const err = new Error("Cal indicar l'id i les dades de la persona");
      err.status = 400;
      throw err;
    }
    if (typeof persona.email !== "string" || !persona.email.trim()) {
      const err = new Error("Cal el correu de la persona a qui es presta");
      err.status = 400;
      throw err;
    }
    if (typeof persona.nom !== "string" || !persona.nom.trim()) {
      const err = new Error("Cal indicar el nom de la persona a qui es presta");
      err.status = 400;
      throw err;
    }
    if (!persona.email.endsWith("@institut.cat")) {
      return enviar(res, 403, { error: "Només per a correus del centre" });
    }

    const nou = material.prestar(inventari, id, persona.nom);
    await new Promise((resolve, reject) => {
      desarAsync(nou, (err) => (err ? reject(err) : resolve()));
    });
    inventari = nou;
    req.log.info({ id }, "préstec registrat");
    enviar(res, 201, material.cercar(inventari, id));
  }

  return http.createServer((req, res) => {
    const inici = performance.now();

    req.id = req.headers["x-request-id"] ?? crypto.randomUUID();
    req.log = logger.child({ reqId: req.id });
    res.setHeader("X-Request-Id", req.id);

    res.on("finish", () => {
      const ms = Math.round(performance.now() - inici);
      const estat = res.statusCode;
      const nivell = estat >= 500 ? "error" : estat >= 400 ? "warn" : "info";
      req.log[nivell]({ metode: req.method, ruta: new URL(req.url, "http://localhost").pathname, estat, ms }, "petició atesa");
    });

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
        const fragments = [];
        req.on("data", (tros) => fragments.push(tros));
        req.on("end", () => {
          const cos = Buffer.concat(fragments).toString("utf8");
          cuaPrestecs = cuaPrestecs.then(() => prestec(req, res, cos)).catch((err) => enviarError(req, res, err));
        });
        return;
      }
      enviar(res, 404, { error: "Ruta no trobada" });
    } catch (err) {
      enviarError(req, res, err);
    }
  });
}

if (require.main === module) {
  const servidor = crearServidor();
  servidor.listen(PORT, () => logger.info({ port: PORT }, "servidor escoltant"));
}

module.exports = { crearServidor };
