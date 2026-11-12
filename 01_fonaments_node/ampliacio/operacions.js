const suma = (n1, n2) => n1 + n2;
const resta = (n1, n2) => n1 - n2;
const multiplica = (n1, n2) => n1 * n2;
const divideix = (n1, n2) => {
    if (n2 === 0) throw new Error("no es pot dividir per zero");
    return n1/n2;
}
module.exports = { suma, resta, multiplica, divideix };
