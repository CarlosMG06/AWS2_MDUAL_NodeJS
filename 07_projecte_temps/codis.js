// Ve fet · Open-Meteo dona l'estat del cel amb un codi numèric (codis WMO).
// descripcio(codi) el tradueix a un text en català.

const CODIS = {
  0: "Cel serè",
  1: "Majoritàriament serè",
  2: "Parcialment ennuvolat",
  3: "Ennuvolat",
  45: "Boira",
  48: "Boira gebradora",
  51: "Plugim feble",
  53: "Plugim moderat",
  55: "Plugim intens",
  56: "Plugim gelat",
  57: "Plugim gelat intens",
  61: "Pluja feble",
  63: "Pluja moderada",
  65: "Pluja forta",
  66: "Pluja gelada",
  67: "Pluja gelada forta",
  71: "Nevada feble",
  73: "Nevada moderada",
  75: "Nevada forta",
  77: "Neu granulada",
  80: "Ruixats febles",
  81: "Ruixats moderats",
  82: "Ruixats violents",
  85: "Ruixats de neu febles",
  86: "Ruixats de neu forts",
  95: "Tempesta",
  96: "Tempesta amb calamarsa",
  99: "Tempesta amb calamarsa forta",
};

export function descripcio(codi) {
  return CODIS[codi] ?? `Codi desconegut (${codi})`;
}
