import * as api from "./api.js";
import { TIPUS, el, fitxa, missatge, nomBonic, targeta } from "./components.js";

const PER_PAGINA = 12;
const estat = { offset: 0, total: 0, tipus: "" };

const $ = (selector) => document.querySelector(selector);

// ---------- Avisos (correcte o error), 4 segons
let temporitzador;
function avis(text, tipus = "error") {
  const caixa = $("#avis");
  caixa.textContent = text;
  caixa.className = `avis avis-${tipus}`;
  caixa.hidden = false;
  clearTimeout(temporitzador);
  temporitzador = setTimeout(() => (caixa.hidden = true), 4000);
}

// ---------- Navegació entre les tres vistes
function mostrarVista(nom) {
  for (const vista of document.querySelectorAll(".vista")) vista.hidden = vista.id !== `vista-${nom}`;
  for (const boto of document.querySelectorAll("[data-vista]")) boto.classList.toggle("actiu", boto.dataset.vista === nom);
  if (nom === "preferits") carregarPreferits();
}

// ---------- 1 · Pokédex
async function carregarPagina() {
  const graella = $("#graella");
  graella.replaceChildren(missatge("Carregant…"));
  try {
    const pagina = await api.llistar(PER_PAGINA, estat.offset, estat.tipus);
    estat.total = pagina.total;
    // El llistat només porta id i nom: demanem les fitxes de la pàgina alhora
    const resultats = await Promise.allSettled(pagina.resultats.map((p) => api.obtenir(p.id)));
    const pokemons = resultats.filter((r) => r.status === "fulfilled").map((r) => r.value);
    graella.replaceChildren(...pokemons.map((p) => targeta(p, { onObrir: obrirFitxa })));
    if (pokemons.length === 0) graella.replaceChildren(missatge("No hi ha cap Pokémon."));
  } catch (err) {
    graella.replaceChildren(missatge(err.message, "error"));
  }
  actualitzarPaginacio();
}

function actualitzarPaginacio() {
  const actual = Math.floor(estat.offset / PER_PAGINA) + 1;
  const total = Math.max(1, Math.ceil(estat.total / PER_PAGINA));
  $("#pagina").textContent = `Pàgina ${actual} de ${total}`;
  $("#anterior").disabled = estat.offset === 0;
  $("#seguent").disabled = estat.offset + PER_PAGINA >= estat.total;
}

function obrirFitxa(pokemon) {
  $("#contingut-fitxa").replaceChildren(fitxa(pokemon, { onPreferit: afegirPreferit }));
  $("#fitxa").showModal();
}

async function cercar(e) {
  e.preventDefault();
  const valor = $("#cerca").value.trim().toLowerCase();
  if (!valor) return;
  try {
    obrirFitxa(await api.obtenir(valor));
  } catch (err) {
    avis(err.status === 404 ? `No hi ha cap Pokémon anomenat «${valor}»` : err.message);
  }
}

// ---------- 2 · Quin Pokémon ets?
async function quinEts(nom) {
  const resultat = $("#resultat-quin-ets");
  resultat.replaceChildren(missatge("Buscant…"));
  try {
    const dades = await api.quinPokemonEts(nom);
    const enllac = `${location.origin}${location.pathname}?ets=${encodeURIComponent(nom)}`;
    const camp = el("input", { type: "text", value: enllac, readonly: "", "aria-label": "Enllaç per compartir" });
    const copiar = el("button", { type: "button", text: "Copia l'enllaç", onclick: () => copiarEnllac(camp) });
    resultat.replaceChildren(
      el("div", { class: "resultat" }, [
        el("p", { class: "frase", text: dades.frase }),
        targeta(dades.pokemon, { onObrir: obrirFitxa }),
        el("div", { class: "compartir" }, [camp, copiar]),
      ]),
    );
  } catch (err) {
    resultat.replaceChildren(missatge(err.message, "error"));
  }
}

async function copiarEnllac(camp) {
  try {
    await navigator.clipboard.writeText(camp.value); // només funciona a localhost o amb HTTPS
    avis("Enllaç copiat", "ok");
  } catch {
    camp.select(); // si no es pot, el deixem seleccionat per copiar-lo a mà
    avis("Copia l'enllaç seleccionat amb Ctrl+C", "ok");
  }
}

// ---------- 3 · Preferits
async function afegirPreferit(pokemon) {
  try {
    await api.afegirPreferit(pokemon.nom); // POST /preferits
    avis(`${nomBonic(pokemon.nom)} afegit als preferits`, "ok");
    actualitzarComptador();
  } catch (err) {
    avis(err.message); // 409 si ja hi és
  }
}

async function carregarPreferits() {
  const llista = $("#llista-preferits");
  try {
    const { total, preferits } = await api.llistarPreferits(); // GET /preferits
    $("#num-preferits").textContent = total;
    if (total === 0) return llista.replaceChildren(missatge("Encara no tens cap preferit. Obre una fitxa i afegeix-n'hi un."));
    llista.replaceChildren(
      ...preferits.map((p) =>
        targeta(p, {
          accio: el("button", { type: "button", class: "secundari", text: "Treu", onclick: () => treurePreferit(p) }),
        }),
      ),
    );
  } catch (err) {
    llista.replaceChildren(missatge(err.message, "error"));
  }
}

async function treurePreferit(pokemon) {
  try {
    await api.treurePreferit(pokemon.nom); // DELETE /preferits/:nom → 204
    avis(`${nomBonic(pokemon.nom)} ja no és als preferits`, "ok");
    carregarPreferits();
  } catch (err) {
    avis(err.message);
  }
}

async function actualitzarComptador() {
  try {
    const { total } = await api.llistarPreferits();
    $("#num-preferits").textContent = total;
  } catch {
    // si l'API no respon, ja ho veurem en una altra crida
  }
}

// ---------- Inici
function iniciar() {
  const select = $("#tipus");
  for (const [valor, nom] of Object.entries(TIPUS)) select.append(el("option", { value: valor, text: nom }));

  for (const boto of document.querySelectorAll("[data-vista]")) {
    boto.addEventListener("click", () => mostrarVista(boto.dataset.vista));
  }
  $("#form-cerca").addEventListener("submit", cercar);
  select.addEventListener("change", () => {
    estat.tipus = select.value;
    estat.offset = 0;
    carregarPagina();
  });
  $("#anterior").addEventListener("click", () => {
    estat.offset = Math.max(0, estat.offset - PER_PAGINA);
    carregarPagina();
  });
  $("#seguent").addEventListener("click", () => {
    estat.offset += PER_PAGINA;
    carregarPagina();
  });
  $("#form-quin-ets").addEventListener("submit", (e) => {
    e.preventDefault();
    quinEts($("#nom-persona").value.trim());
  });

  carregarPagina();
  actualitzarComptador();

  // Enllaç compartit: index.html?ets=Marta obre directament el resultat
  const nom = new URLSearchParams(location.search).get("ets");
  if (nom) {
    $("#nom-persona").value = nom;
    mostrarVista("quin-ets");
    quinEts(nom);
  }
}

iniciar();
