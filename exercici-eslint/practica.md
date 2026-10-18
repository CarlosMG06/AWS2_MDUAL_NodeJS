# Guia ESLint · 11 · Pràctica

### 1.

Resultat ```npx eslint revisa.js```:
```
   2:7   error  'path' is assigned a value but never used                        no-unused-vars
  13:12  error  'err' is defined but never used                                  no-unused-vars
  14:5   error  There is no `cause` attached to the symptom error being thrown   preserve-caught-error
  19:7   error  Expected a conditional expression and instead saw an assignment  no-cond-assign
  19:7   error  Unexpected constant condition                                    no-constant-condition
  21:5   error  Unreachable code                                                 no-unreachable
  26:45  error  Duplicate key 'nom'                                              no-dupe-keys
  27:9   error  'prestatA' is assigned a value but never used                    no-unused-vars
  29:8   error  'total' is not defined                                           no-undef
  29:20  error  Empty block statement                                            no-empty

✖ 10 problems (10 errors, 0 warnings)
```

### 2.

Canvis a ```revisa.js```:
```
 1    1   const fs = require("node:fs");
 2     —  const path = require("node:path");
 ⠸    ⠸
 ⠸    ⠸ 
13     —    } catch (err) {
     12+    } catch {
 ⠸    ⠸  
 ⠸    ⠸ 
19     —    if (element.estat = "prestat") {
20     —      return "No disponible";
19   18+    if (element.estat === "prestat") {  
21   19       console.log("Prestat a", element.prestatA);
     20+      return "No disponible";
 ⠸    ⠸
 ⠸    ⠸
26     —  const element = { nom: "HP 14", valor: 450, nom: "Lenovo" };
27     —  const { prestatA, ...resta } = element;
28     — 
29     —  while (total < 10) {}
     25+  const element = { nom: "HP 14", valor: 450 };
     26+  const { ...resta } = element;
30   27   
31   28   console.log(mitjana([4, 8]), llegir, estat(element), resta);
```

### 3.

L'error que no ESLint no veu és que la propietat ```length``` de la variable ```numeros``` està escrita malament (```lenght```). 

ESLint no el pot detectar perquè ```numeros``` és un paràmetre de la funció ```mitjana```, així que és de tipus ```any``` i no té cap propietat definida.

Canvi a ```revisa.js```:
```
 6     —    return suma / numeros.lenght;
      6+    return suma / numeros.length;
```
