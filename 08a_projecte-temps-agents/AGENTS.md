# Regles del projecte
 
## Entorn
- Node.js 24 amb ES Modules ("type": "module")
- Servidor amb `node:http`. No facis servir Express
- Peticions amb `fetch` natiu. No facis servir axios
- Logs amb `pino`. Cap `console.log` al servidor
- Tests amb `node:test` i `node:assert/strict`. No facis servir Jest
- No instal·lis cap dependència nova
 
## Estil
- Noms de variables, funcions i comentaris en català
- Estructura plana: tots els fitxers a l'arrel del projecte
- Les funcions de `meteo.js` reben `fetch` com a últim paràmetre
 
## Com has de treballar
- Proposa un pla abans de modificar cap fitxer
- Una tasca cada vegada, amb canvis petits
- En acabar una tasca, executa `npm run lint` i `npm test`
- No facis `git commit` ni `git push`: els faig jo
- Respon en català
