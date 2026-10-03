const m = require("./material.js");

const ordre = process.argv[2];
const args = process.argv.slice(3);

const missatgeUs = `Ús: node inventari.js <ordre> 
    { llistar
    | filtrar <filtre=valor> [filtre=valor...]
    | alta <nom> <tipus> <aula> <valor>
    | prestar <id> <persona>
    | retornar <id>
    | stats 
    }`;

try {
    const dades = m.llegir();
    switch (ordre) {
        case "llistar": 
            dades.forEach(elem => console.log(m.linia(elem)));
            break;
        case "filtrar":
            const filtres = Object.fromEntries(args.map(arg => arg.split("=")));
            const dadesFiltrades = m.filtrar(dades, filtres);
            console.log(`${dadesFiltrades.length} element(s):`)
            dadesFiltrades.forEach(elem => console.log(m.linia(elem)));
            break;
        case "alta":
            const [nom, tipus, aula, valorStr] = args;
            const nou = m.crear(nom, tipus, aula, valorStr);
            m.desar([...dades, nou]);
            console.log(`Alta feta: ${m.linia(nou)}`);
            break;
        case "prestar":
            const [iniciIdP, persona] = args;
            const elemIdP = m.cercar(dades, iniciIdP);
            const dadesNovesP = m.prestar(dades, iniciIdP, persona);
            m.desar(dadesNovesP);
            console.log(`Prestat: ${elemIdP.nom} → ${persona}`);
            break;
        case "retornar": 
            const iniciIdR = args[0];
            const elemIdR = m.cercar(dades, iniciIdR);
            const {prestatA, ...resta} = elemIdR;
            const dadesNovesR = m.retornar(dades, iniciIdR);
            m.desar(dadesNovesR);
            console.log(`Retornat: ${elemIdR.nom} (el tenia ${prestatA})`);
            break;
        case "stats":
            const {elements, vTotal, perTipus, perAula, 
                vMitja, vMax, materialAvariat, totTeAula} = m.estadistiques(dades);
            console.log(`Elements: ${dades.length} · Valor total: ${m.euros(vTotal)}`);
            console.log(`Valor mitjà: ${m.euros(vMitja)}`);
            console.log("Per tipus:", Object.keys(perTipus).map(tipus => `${tipus} ${perTipus[tipus]}`).join(" · "));
            console.log("Per aula: ", perAula.map(aula => `${aula[0]} ${aula[1]}`).join(" · "));
            console.log(`Més valuós: ${vMax.nom} (${m.euros(vMax.valor)})`);
            console.log(`Hi ha material avariat? ${materialAvariat ? "sí" : "no"}`);
            console.log(`Tot té aula assignada? ${totTeAula ? "sí" : "no"}`);
            break;
        default:
            console.log(missatgeUs);
            process.exitCode = 1;
            break;
    }
} catch (error) {
    console.log(`Error: ${error.message}`);
    process.exitCode = 1;
}
