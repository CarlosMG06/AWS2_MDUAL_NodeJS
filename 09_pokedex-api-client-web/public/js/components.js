// Funcions que converteixen les dades de l'API en elements de la pàgina.
// Sempre textContent, mai innerHTML amb dades externes: així no s'hi pot colar codi (XSS).

export const TIPUS = {
  normal: "Normal", fire: "Foc", water: "Aigua", grass: "Planta", electric: "Elèctric",
  ice: "Gel", fighting: "Lluita", poison: "Verí", ground: "Terra", flying: "Volador",
  psychic: "Psíquic", bug: "Insecte", rock: "Roca", ghost: "Fantasma", dragon: "Drac",
  dark: "Sinistre", steel: "Acer", fairy: "Fada",
};

const ESTADISTIQUES = { vida: "Vida", atac: "Atac", defensa: "Defensa", velocitat: "Velocitat" };

// Crea un element: el("p", { class: "nom", text: "Pikachu" }, [fills])
export function el(etiqueta, atributs = {}, fills = []) {
  const node = document.createElement(etiqueta);
  for (const [clau, valor] of Object.entries(atributs)) {
    if (clau === "text") node.textContent = valor;
    else if (clau.startsWith("on")) node.addEventListener(clau.slice(2), valor);
    else node.setAttribute(clau, valor);
  }
  node.append(...fills);
  return node;
}

export function nomBonic(nom) {
  return nom
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function numero(id) {
  return `#${String(id).padStart(4, "0")}`;
}

function imatge(pokemon, classe) {
  // Les imatges petites (96 × 96) es veuen millor sense suavitzar
  const petita = !pokemon.imatge?.includes("official-artwork");
  return el("img", {
    src: pokemon.imatge ?? "",
    alt: nomBonic(pokemon.nom),
    class: `${classe}${petita ? " pixelada" : ""}`,
    loading: "lazy",
  });
}

export function etiquetaTipus(tipus) {
  return el("span", { class: `tipus tipus-${tipus}`, text: TIPUS[tipus] ?? tipus });
}

// Targeta petita per a les graelles
export function targeta(pokemon, { onObrir, accio } = {}) {
  const fills = [
    imatge(pokemon, "sprite"),
    el("span", { class: "numero", text: numero(pokemon.id) }),
    el("h3", { text: nomBonic(pokemon.nom) }),
    el("div", { class: "llista-tipus" }, pokemon.tipus.map(etiquetaTipus)),
  ];
  if (accio) fills.push(accio);
  const atributs = { class: "targeta" };
  if (onObrir) {
    atributs.tabindex = "0";
    atributs.role = "button";
    atributs.onclick = (e) => { if (!e.target.closest("button")) onObrir(pokemon); };
    atributs.onkeydown = (e) => { if (e.key === "Enter") onObrir(pokemon); };
  }
  return el("article", atributs, fills);
}

// Contingut de la fitxa (dins del <dialog>)
export function fitxa(pokemon, { onPreferit }) {
  const barres = Object.entries(ESTADISTIQUES).map(([clau, nom]) => {
    const valor = pokemon.estadistiques[clau];
    const barra = el("span", { class: "barra" });
    barra.style.width = `${Math.min(100, (valor / 160) * 100)}%`;
    return el("div", { class: "estadistica" }, [
      el("span", { text: nom }),
      el("span", { class: "fons-barra" }, [barra]),
      el("strong", { text: String(valor) }),
    ]);
  });

  return el("div", { class: "fitxa" }, [
    imatge(pokemon, "imatge-gran"),
    el("div", {}, [
      el("span", { class: "numero", text: numero(pokemon.id) }),
      el("h2", { text: nomBonic(pokemon.nom) }),
      el("div", { class: "llista-tipus" }, pokemon.tipus.map(etiquetaTipus)),
      el("p", { class: "mides", text: `Alçada: ${pokemon.alcada} m · Pes: ${pokemon.pes} kg` }),
      el("div", { class: "estadistiques" }, barres),
      el("button", { type: "button", text: "★ Afegeix als preferits", onclick: () => onPreferit(pokemon) }),
    ]),
  ]);
}

export function missatge(text, classe = "buit") {
  return el("p", { class: classe, text });
}
