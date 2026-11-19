# El temps de la meva ciutat · ampliació amb agents

Activitat 8a del curs MDUAL de Node.js. És el projecte de l'Activitat 7 i el punt de partida del tutorial
`MDUAL_NodeJS__08a_Tutorial_Ampliacio_Agents.docx`.

```
client.js  →  servidor.js  →  meteo.js  →  Open-Meteo
```

**Compte:** aquest codi porta tres errors posats expressament. Trobar-los és la primera part del tutorial.

## Com s'executa

Cal Node.js 24 o superior.

```bash
npm install
npm start          # engega l'API al port 3000 (npm run dev per veure els logs formatats)
```

En un altre terminal:

```bash
node client.js temps Barcelona
node client.js compara Lleida Barcelona Girona
```

Comprovacions: `npm run lint`, `npm test` i, amb l'API engegada, `npm run prova-api`.

> Quan acabis el tutorial, substitueix aquest fitxer pel README del teu projecte: què fa, com s'executa,
> les rutes de l'API (també les noves) i les decisions que has pres.
