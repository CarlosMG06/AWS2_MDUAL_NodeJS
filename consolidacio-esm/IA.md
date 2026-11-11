# Registre d'ús de la IA · Activitat 6

Eina: GitHub Copilot - GPT-6 Luna (OpenAI)

## 1 · La meva llista (abans de preguntar a la IA)

Quins creus que són els tres tests més importants de `material.js`? Escriu-los abans d'obrir el xat.

1. Filtrar per estat vàlid
2. Prestar un material disponible
3. Prestar un material no disponible llença error

Altres:
- Filtrar per estat no vàlid llença error
- Prestar amb nom buit llença error
- Prestar un material inexistent llença error

## 2 · El prompt

Tinc un projecte de Node.js 24 en ES Modules ("type": "module"). Per als tests faig servir només node:test i node:assert, sense instal·lar res.
He adjuntat el meu mòdul material.js. Les funcions llencen errors amb una propietat status (400, 404 o 409).
Quins són els cinc tests més importants que hauria de tenir per comprovar el funcionament d'aquest mòdul? Per a cada un, digues què comprova, per què és important i si és unitari o d’integració. No escriguis encara el codi.

## 3 · Què proposa la IA i què decideixo

| # | Test proposat | Unitari o d'integració | Decisió (accepto, modifico o rebutjo) | Motiu |
| --- | --- | --- | --- | --- |
| 1 | Filtrar per un estat vàlid | Unitari | accepto | test adequat |
| 2 | Rebutjar un estat no vàlid | Unitari | accepto | test adequat |
| 3 | Cercar un codi existent i un d'inexistent | Unitari | modifico | cal separar-lo en dos tests |
| 4 | Prestar un material disponible | Unitari | accepto | test adequat |
| 5 | Comprovar els errors de préstec | Unitari | modifico | cal separar-lo en tres tests |

## 4 · Els tests que he implementat

| Test | Fitxer | Passa amb npm test? |
| --- | --- | --- |
| 1. Filtrar per estat vàlid | `material.test.js` | Sí |
| 2. Filtrar per estat no vàlid llença error 400 | `material.test.js` | Sí |
| 3. Cercar un codi existent | `material.test.js` | Sí |
| 4. Cercar un codi inexistent llença error 404 | `material.test.js` | Sí |
| 5. Prestar un material disponible | `material.test.js` | Sí |
| 6. Prestar un material no disponible llença error 409 | `material.test.js` | Sí |
| 7. Prestar un material inexistent llença error 404 | `material.test.js` | Sí |
| 8. Prestar amb el nom buit llença error 400 | `material.test.js` | Sí |

## 5 · Reflexió

- Quin test de la IA no se t'havia acudit?

No se m'havia acudit testejar la funció `cercar`. Encara que mai es crida a altres mòduls actualment, és útil crear-ne tests per poder identificar la funció exacta que causa un problema determinat, sense deixar dubte de si la causa està dins `prestar` o dins `cercar`.  

- Quina proposta has rebutjat i per què?

No he rebutjat cap proposta, però sí que he dividit propostes en tests més concrets.

- Has trobat algun error o invent de la IA (una eina que no fem servir, una funció que no existeix, una sintaxi que no és ES Modules…)?

La IA no ha generat cap error ni invent significatiu. 
No obstant això, ha fet servir la funció `structuredClone(...)` per crear una còpia de l'inventari. És una funció que, tot i senzilla, no hem treballat. L'he substituït amb una manera diferent de crear una còpia separada de les dades, fent servir eines ja treballades.
