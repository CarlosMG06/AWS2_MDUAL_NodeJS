import { Router } from "express";

export const rutesPreferits = Router();

// TODO Pas 4: una llista en memòria (es buida cada cop que reinicies el servidor)
// TODO Pas 4: GET /preferits → { total, preferits }
// TODO Pas 4: POST /preferits amb { "nom": "pikachu" }
//   201 amb { id, nom, tipus, imatge, afegit }
//   400 si no hi ha nom · 404 si no existeix · 409 si ja hi és
// Recorda muntar aquest router a app.js i afegir express.json()
