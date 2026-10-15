function disponibles(llista) {
    return llista.filter((m) => m.estat === "disponible");
}

function valorTotal(llista) {
    return llista.reduce((suma, m) => suma + m.valor, 0);
}

// --- Exercici 1.c
function perEstat(llista) {
    return llista.reduce((sumes, m) => {
        if (!sumes[m.estat]) sumes[m.estat] = 0;
        sumes[m.estat]++;
        return sumes;
    }, {});
}

module.exports = { disponibles, valorTotal, perEstat };
// ---