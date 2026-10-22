# Respostes · Activitat 5

## Pas 1 · Diagnòstic (amb el codi de partida)

### importa.js
- Quins elements s'han importat i quins no? Per què no?

Segons `importats.json`, s'han importat els següents elements: Portàtil HP 15, Monitor Dell 24 polzades, Cable HDMI 3 m, Webcam Logitech C270, Ratolí Logitech M185

No es pot saber quins elements no s'han importat ni per què no.

- Què conté importats.json després de `node importa.js data/compra-octubre.csv > importats.json`?

Conté uns missatges bàsics del procés d'importació i després el JSON de les dades importades amb èxit.
Quan no pot importar un element tan sols es registra `Error en una fila`.
- Amb quin codi de sortida acaba? I sense arguments?

Amb arguments, acaba amb el codi de sortida `0` (és a dir, "èxit"). Sense arguments, tot i que mostra `TypeError [ERR_INVALID_ARG_TYPE]`, el codi de sortida segueix sent `0`.

### servidor.js
- Una de les peticions de trafic.js acaba amb un 500. Quina és i per què falla?

La petició que falla és la número 10:

`10. POST /prestecs                    → 500 Error intern`

La qual en el servidor surt així:

```
22/10/2026, 18:28:05 POST /prestecs {"authorization":"Bearer aula-2026","content-type":"application/json","content-length":"44","host":"localhost:3000","connection":"keep-alive"}
Préstec: 9a1c { nom: 'Marta Puig' }
error
```

Amb la terminal, no es pot saber per què falla. Només es mostra `error`.

- Quina petició ha trigat més?

No es pot saber. Totes les peticions s'executen dins un únic segon i només es registra el segon de l'execució, sense cap temporització més precisa:

```
22/10/2026, 18:28:05 GET /material {...}
22/10/2026, 18:28:05 GET /material?estat=disponible {...}
22/10/2026, 18:28:05 GET /material/f38b {...}
22/10/2026, 18:28:05 POST /prestecs {...}
Préstec: f38b {...}
22/10/2026, 18:28:05 GET /material/zzzz {...}
22/10/2026, 18:28:05 POST /prestecs {...}
Préstec: e512 {...}
22/10/2026, 18:28:05 POST /prestecs {...}
22/10/2026, 18:28:05 POST /prestecs {...}
Préstec: 7dab {...}
22/10/2026, 18:28:05 GET /material/f3 {...}
22/10/2026, 18:28:05 POST /prestecs {...}
error
22/10/2026, 18:28:05 POST /prestecs {...}
```

- Quines dades que no haurien de sortir apareixen al terminal del servidor?

Apareixen dades sensibles: e-mails (`email`), noms amb cognom (`nom`) i dades d'autorització al servidor (`authorization`). 

## Pas 6 · Incidència (logs/produccio.ndjson)
1. Quantes peticions hi ha hagut i amb quin estat han acabat?
2. Petició 3c9e1b2a: quin error hi ha, a quin fitxer i a quina línia?
3. Des de quan hi ha errors 500? Coincideix amb alguna cosa que hagi passat al servidor?
4. Quina ha estat la petició més lenta?
5. Entre les 09:10 i les 09:24 (UTC) hi ha molts 401: què creus que va passar?

## Conclusions
- Què ha canviat entre el Pas 1 i el Pas 6 per poder respondre les mateixes preguntes?
