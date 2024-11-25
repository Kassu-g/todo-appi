const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const api1 = express();
const PORTTI = 3000;
api1.use(cors());
api1.use(bodyParser.json());
api1.use(express.static('public'));
let kayttis = [];
const tallenna = () => {
    fs.writeFileSync('server/data.json', JSON.stringify(kayttis, null, 2));
};
const lataa = () => {
    if (fs.existsSync('server/data.json')) {
        kayttis = JSON.parse(fs.readFileSync('server/data.json'));
    }
};
lataa();
api1.post('/add', (pyynto, vastaus) => {
    const { nimi, tehtava } = pyynto.body;

    if (!nimi || !tehtava) {
        return vastaus.status(400).send('Inputit ovat pakollisia.');
    }
    let kayttaja = kayttis.find(k => k.nimi === nimi);
    if (kayttaja) {
        kayttaja.tehtavat.push(tehtava);
    } else {
        kayttaja = { nimi, tehtavat: [tehtava] };
        kayttis.push(kayttaja);
    }

    tallenna();

    vastaus.send(`Todo added successfully for user ${nimi}.`);
});
api1.get('/todos/:id', (pyynto, vastaus) => {
    const { id } = pyynto.params;

    const kayttaja = kayttis.find(k => k.nimi === id);

    if (kayttaja) {
        vastaus.json(kayttaja.tehtavat);
    } else {
        vastaus.status(404).send('User not found.');
    }
});
api1.delete('/delete', (pyynto, vastaus) => {
    const { nimi } = pyynto.body;
    const poisto = kayttis.findIndex(k => k.nimi === nimi);
    if (poisto !== -1) {
        kayttis.splice(poisto, 1);
        tallenna();
        vastaus.send('User deleted successfully.');
    } else {
        vastaus.status(404).send('User not found.');
    }
});
api1.put('/update', (pyynto, vastaus) => {
    const { nimi, tehtava } = pyynto.body;
    let kayttaja = kayttis.find(k => k.nimi === nimi);
    if (!kayttaja) {
        return vastaus.status(404).send('User not found');
    }
    const todo = kayttaja.tehtavat.indexOf(tehtava);
    if (todo === -1) {
        return vastaus.status(404).send('Not found');
    }

    kayttaja.tehtavat.splice(todo, 1);
    tallenna();
    vastaus.send('Todo deleted successfully.');
});

api1.listen(PORTTI, () => console.log(`Täällä toimii http://localhost:${PORTTI}`));



