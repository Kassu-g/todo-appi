const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const sovellus = express();
const PORTTI = 3000;
sovellus.use(cors());
sovellus.use(bodyParser.json());
sovellus.use(express.static('public'));
let kayttajat = [];
const tallennaDataTiedostoon = () => {
    fs.writeFileSync('server/data.json', JSON.stringify(kayttajat, null, 2));
};
const lataaDataTiedostosta = () => {
    if (fs.existsSync('server/data.json')) {
        kayttajat = JSON.parse(fs.readFileSync('server/data.json'));
    }
};
lataaDataTiedostosta();
sovellus.post('/add', (pyynto, vastaus) => {
    const { nimi, tehtava } = pyynto.body;

    if (!nimi || !tehtava) {
        return vastaus.status(400).send('inputit ovat pakollisia.');
    }

    let kayttaja = kayttajat.find(k => k.nimi === nimi);
    if (kayttaja) {
        kayttaja.tehtavat.push(tehtava);
    } else {
        kayttaja = { nimi, tehtavat: [tehtava] };
        kayttajat.push(kayttaja);
    }

    tallennaDataTiedostoon();
    vastaus.send(`Todo added successfully for user ${nimi}.`);
});
sovellus.listen(PORTTI, () => console.log(`Täällä toimii http://localhost:${PORTTI}`));
