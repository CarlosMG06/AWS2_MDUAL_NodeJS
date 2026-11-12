const salutacions = { ca: "Bon dia", es: "Buenos días", en: "Good morning" }
const nom = process.env.NOM || "desconegut";
const idioma = process.env.IDIOMA || "ca";

console.log(`${salutacions[idioma]}, ${nom}!`);
