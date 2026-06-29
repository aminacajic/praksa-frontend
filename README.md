# BH Sport – baza sportista Bosne i Hercegovine

Web aplikacija za prikaz sportova i sportista Bosne i Hercegovine, sa
administratorskim panelom za unos i uređivanje podataka. Izrađena u
React-u (Vite), kao nastavak originalne vanilla HTML/CSS/JS verzije.

> Ovo je faza projekta bez backenda (Week 1 + Week 2). Podaci o sportovima/sportistima su hardkodirani direktno u
> frontend kodu (`src/data/podaci.js`), a sve izmjene u Admin panelu (dodaj/
> uredi/obriši) rade se samo u memoriji dok je stranica otvorena, ne
> čuvaju se trajno. 

**Eksterni API**
- [DummyJSON](https://dummyjson.com) – za stranicu Vijesti (sportski artikli)

## Funkcionalnosti

- **Početna stranica** – lista svih sportova, sa pretragom 
- **Detalji sporta** – galerija slika, lista sportista sa pretragom
- **Detalji sportiste** – biografija i najveći uspjesi
- **Vijesti** – dohvat artikala sa eksternog API-ja (Fetch API)
- **Admin panel** (radi nad podacima u memoriji, bez backenda)
  - dodavanje / uređivanje sporta (naziv, opis, slika, galerija, pozicije)
  - dodavanje / uređivanje sportiste (ime, pozicija, slika, biografija), uz
    mogućnost dodavanja nove pozicije direktno iz forme
  - pregled, pretraga i brisanje sportova/sportista
- Responsive dizajn (mobilni, tablet, desktop prikaz)

## Pokretanje projekta

```bash
cd frontend
npm install
npm run dev
```

Aplikacija se pokreće na `http://localhost:5173`.

### Produkcijski build

```bash
cd frontend
npm run build
```

## Napomena

Slike koje se uploaduju kroz Admin formu prikazuju se privremeno (preko `URL.createObjectURL`) i važe
samo dok je stranica otvorena, jer još nema backenda koji bi ih trajno snimio.
