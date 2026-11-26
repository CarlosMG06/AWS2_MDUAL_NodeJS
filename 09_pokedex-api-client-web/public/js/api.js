// Totes les peticions a l'API passen per aquest fitxer.
// Les rutes comencen per /api: el servidor del client les reenvia a l'API (localhost:3000).

export class ErrorApi extends Error {
  constructor(status, missatge) {
    super(missatge);
    this.status = status;
  }
}

async function demanar(ruta, opcions = {}) {
  let resposta;
  try {
    resposta = await fetch(`/api${ruta}`, opcions);
  } catch {
    // fetch només falla si no arriba cap resposta: el client web està aturat
    throw new ErrorApi(0, "No es pot connectar amb el servidor del client web");
  }

  if (resposta.status === 204) return null; // fet, sense cos

  const dades = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    // L'API sempre respon { "error": "…" } quan alguna cosa va malament
    throw new ErrorApi(resposta.status, dades.error ?? `Error ${resposta.status}`);
  }
  return dades;
}

export function llistar(limit, offset, tipus) {
  const query = new URLSearchParams({ limit, offset });
  if (tipus) query.set("tipus", tipus);
  return demanar(`/pokemon?${query}`);
}

export function obtenir(nomOId) {
  return demanar(`/pokemon/${encodeURIComponent(nomOId)}`);
}

export function quinPokemonEts(nom) {
  return demanar(`/quin-pokemon-ets/${encodeURIComponent(nom)}`);
}

export function llistarPreferits() {
  return demanar("/preferits");
}

export function afegirPreferit(nom) {
  return demanar("/preferits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom }),
  });
}

export function treurePreferit(nom) {
  return demanar(`/preferits/${encodeURIComponent(nom)}`, { method: "DELETE" });
}
