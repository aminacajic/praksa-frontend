const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const jsonPutanja = path.join(__dirname, 'data', 'podaci.json');

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'images/'); },
    filename: function (req, file, cb) { cb(null, file.originalname); }
});
const upload = multer({ storage: storage });

const konfiguracijaSportUploada = upload.fields([
    { name: 'slikaSporta', maxCount: 1 },
    { name: 'galerijaSlike', maxCount: 10 }
]);

app.post('/api/spasi-sport', konfiguracijaSportUploada, (req, res) => {
    const { id, naziv, opis, savez, pozicije } = req.body;

    if (!req.files || !req.files['slikaSporta']) {
        return res.status(400).json({ poruka: 'Greška: Glavna slika sporta fali!' });
    }

    const glavnaSlikaFajl = req.files['slikaSporta'][0];
    
    let nizPutanjaGalerije = [];
    if (req.files['galerijaSlike']) {
        nizPutanjaGalerije = req.files['galerijaSlike'].map(fajl => `./images/${fajl.originalname}`);
    }

    const noviSport = {
        id: id,
        naziv: naziv,
        slika: `./images/${glavnaSlikaFajl.originalname}`,
        galerija: nizPutanjaGalerije, 
        opis: opis,
        savez: savez,
        pozicije: JSON.parse(pozicije), 
        sportisti: []
    };

    fs.readFile(jsonPutanja, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ poruka: 'Greška pri čitanju' });
        let sportovi = JSON.parse(data);

        if (sportovi.some(s => s.id === noviSport.id)) {
            return res.status(400).json({ poruka: 'Sport već postoji!' });
        }

        sportovi.push(noviSport);
        fs.writeFile(jsonPutanja, JSON.stringify(sportovi, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ poruka: 'Greška pri upisu' });
            res.json({ poruka: 'Novi sport i njegova galerija slika su uspješno sačuvani!' });
        });
    });
});

app.post('/api/spasi-sportistu', upload.single('slikaIgraca'), (req, res) => {
    const { sportId, ime, uloga, info, jeNovaPozicija } = req.body;
    
    if (!req.file) return res.status(400).json({ poruka: 'Greška: Nedostaje slika!' });

    const noviSportista = {
        ime: ime,
        uloga: uloga,
        info: info,
        slika: `./images/${req.file.originalname}`
    };

    fs.readFile(jsonPutanja, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ poruka: 'Greška pri čitanju' });
        let sportovi = JSON.parse(data);

        const sport = sportovi.find(s => s.id === sportId);
        if (!sport) return res.status(404).json({ poruka: 'Sport nije pronađen' });

        if (jeNovaPozicija === "true") {
            if (!sport.pozicije) sport.pozicije = [];
            
            if (!sport.pozicije.includes(uloga)) {
                sport.pozicije.push(uloga);
            }
        }

        sport.sportisti.push(noviSportista);

        fs.writeFile(jsonPutanja, JSON.stringify(sportovi, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ poruka: 'Greška pri upisu' });
            res.json({ poruka: 'Uspješno sačuvan sportista!' });
        });
    });
});

app.delete('/api/obrisi-sport/:id', (req, res) => {
    const sportId = req.params.id;
    fs.readFile(jsonPutanja, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ poruka: 'Greška pri čitanju' });
        let sportovi = JSON.parse(data);
        const noviSportovi = sportovi.filter(s => s.id !== sportId);

        fs.writeFile(jsonPutanja, JSON.stringify(noviSportovi, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ poruka: 'Greška pri upisu' });
            res.json({ poruka: 'Sport uspješno obrisan!' });
        });
    });
});

app.delete('/api/obrisi-sportistu/:sportId/:ime', (req, res) => {
    const { sportId, ime } = req.params;

    fs.readFile(jsonPutanja, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ poruka: 'Greška pri čitanju' });
        let sportovi = JSON.parse(data);

        const sport = sportovi.find(s => s.id === sportId);
        if (!sport) return res.status(404).json({ poruka: 'Sport nije pronađen' });

        sport.sportisti = sport.sportisti.filter(sp => sp.ime !== ime);

        fs.writeFile(jsonPutanja, JSON.stringify(sportovi, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ poruka: 'Greška pri upisu' });
            res.json({ poruka: 'Sportista uspješno obrisan!' });
        });
    });
});

app.post('/api/uredi-podatke', (req, res) => {
    const kompletnaBaza = req.body;

    fs.writeFile(jsonPutanja, JSON.stringify(kompletnaBaza, null, 2), 'utf8', (err) => {
        if (err) return res.status(500).json({ poruka: 'Greška pri upisu' });
        res.json({ poruka: 'Izmjene su uspješno sačuvane u bazi!' });
    });
});

app.listen(PORT, () => console.log(`Server pokrenut na http://localhost:3000`));