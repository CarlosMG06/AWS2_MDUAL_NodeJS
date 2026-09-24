function sumaFinsA(n) {
  let suma = 0;
  for (let i = 1; i <= n; i++) suma += i;
  return suma;
}
function esParell(n) {
  return n % 2 === 0;
}
function estadistiques(numeros) {
    let numerosInt = [];
    for (i = 0; i < numeros.length; i++) {
        numerosInt.push(parseInt(numeros[i]));
    }

    const minim = Math.min(...numerosInt);
    const maxim = Math.max(...numerosInt);
    let suma = 0;
    for (let i = 0; i < numerosInt.length; i++) {
        suma += numerosInt[i];
    }
    const mitjana = suma/numerosInt.length;
    return `Mínim: ${minim} - Màxim: ${maxim} - Mitjana: ${mitjana}`
}
module.exports = { sumaFinsA, esParell, estadistiques };
