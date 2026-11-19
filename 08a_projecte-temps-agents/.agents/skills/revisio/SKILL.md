---
name: revisio
description: Revisa els canvis abans d'un commit
---
1. Mira el `git diff` respecte de l'últim commit
2. Busca errors no gestionats, promeses sense `await` i noms poc clars
3. Executa `npm run lint` i `npm test`
4. Fes una llista de problemes, de més greu a menys greu
5. No modifiquis cap fitxer
