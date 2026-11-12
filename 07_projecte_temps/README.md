# El temps de la meva ciutat

> Plantilla. Substitueix cada indicació en cursiva pel teu text i esborra aquesta línia.

*Dues o tres frases: què fa el projecte i amb quines peces.*

```
client.js  →  servidor.js  →  meteo.js  →  Open-Meteo
```

## Com s'executa

*Les ordres per instal·lar-lo, engegar l'API i fer servir el client, amb un exemple de cada ordre del client.*

## L'API

| Ruta | Respostes |
| --- | --- |
| `GET /temps/<ciutat>` | *codis d'estat i quan passa cada un* |
| `GET /compara?ciutats=A,B` | |
| Qualsevol altra | |

*Un exemple de resposta en JSON.*

## Estructura

| Fitxer | Què hi ha |
| --- | --- |
| `meteo.js` | |
| `servidor.js` | |
| `logger.js` | |
| `client.js` | |
| `meteo.test.js` | |

## Decisions

*Tres decisions que has pres i per què. Per exemple: per què el client no parla directament amb Open-Meteo, quan fas servir `Promise.all`, o quin codi d'estat respons si Open-Meteo falla.*
