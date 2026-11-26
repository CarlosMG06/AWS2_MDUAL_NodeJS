// Model de l'activitat 9: una API Express petita, amb videojocs en memòria.
// Engega-la amb: node exemples/model.js  i obre http://localhost:3001/jocs
import express from "express";

const jocs = [
  { id: 1, titol: "Hollow Knight", genere: "metroidvania", any: 2017 },
  { id: 2, titol: "Hades", genere: "roguelike", any: 2020 },
  { id: 3, titol: "Celeste", genere: "plataformes", any: 2018 },
  { id: 4, titol: "Dead Cells", genere: "roguelike", any: 2018 },
];
const valoracions = [];

function error(status, missatge) {
  const err = new Error(missatge);
  err.status = status;
  return err;
}

const app = express();
app.use(express.json()); // sense això, req.body és undefined

// req.query · GET /jocs?genere=roguelike
app.get("/jocs", (req, res) => {
  const { genere } = req.query;
  const resultat = genere ? jocs.filter((j) => j.genere === genere) : jocs;
  res.json({ total: resultat.length, jocs: resultat });
});

// req.params · GET /jocs/2
app.get("/jocs/:id", (req, res) => {
  const joc = jocs.find((j) => j.id === Number(req.params.id));
  if (!joc) throw error(404, `No hi ha cap joc amb id ${req.params.id}`);
  res.json(joc);
});

// req.body · POST /valoracions amb { "id": 2, "estrelles": 5 }
app.post("/valoracions", (req, res) => {
  const { id, estrelles } = req.body ?? {};
  if (!Number.isInteger(estrelles) || estrelles < 1 || estrelles > 5) {
    throw error(400, "Les estrelles han de ser un enter de l'1 al 5");
  }
  if (!jocs.some((j) => j.id === id)) throw error(404, `No hi ha cap joc amb id ${id}`);
  if (valoracions.some((v) => v.id === id)) throw error(409, "Aquest joc ja està valorat");
  const nova = { id, estrelles };
  valoracions.push(nova);
  res.status(201).json(nova);
});

app.use((req, res) => res.status(404).json({ error: "Ruta no trobada" }));

app.use((err, req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cos ha de ser JSON" });
  }
  res.status(err.status ?? 500).json({ error: err.status ? err.message : "Error intern" });
});

app.listen(3001, () => console.log("Model a http://localhost:3001/jocs"));
