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

Hi ha hagut 813 peticions.
- 522 peticions han acabat amb estat 200.
- 113 peticions han acabat amb estat 201.
- 20 peticions han acabat amb estat 400.
- 38 peticions han acabat amb estat 401.
- 36 peticions han acabat amb estat 403.
- 32 peticions han acabat amb estat 404.
- 46 peticions han acabat amb estat 409.
- 6 peticions han acabat amb estat 500.

2. Petició 3c9e1b2a: quin error hi ha, a quin fitxer i a quina línia?

Hi ha el següent error: 
- `TypeError: Cannot read properties of undefined (reading 'endsWith)`
- Fitxer `servidor.js`
- Línia 33

És a dir, la línia amb `  if (!persona.email.endsWith("@institut.cat")) {`. Com no té `?.`, si no hi ha email, dona error.

3. Des de quan hi ha errors 500? Coincideix amb alguna cosa que hagi passat al servidor?

Hi ha errors 500 des de 07:16 UTC, coincidint amb el reinici del servidor a las 07:00 UTC.

És possible que aquell reinici va introduir la comprovació de correus del centre (que és el que fa la línia amb la fallada).

4. Quina ha estat la petició més lenta?

Ha estat la petició amb id `4033bce4` a les 10:03 UTC, la qual va trigar 2,318 segons.

5. Entre les 09:10 i les 09:24 (UTC) hi ha molts 401: què creus que va passar?

El codi d'estat `401` vol dir `No Autoritzat`. Per tant, sospito que hi va haver alguna mena d'atac al servidor, tractant de fer peticions sense credencials.

## Conclusions
- Què ha canviat entre el Pas 1 i el Pas 6 per poder respondre les mateixes preguntes?

A més a més que el logging és summament més detallat, també està organitzat en un fitxer JSON, de manera que és considerablement més senzill fer-ne consultes.
