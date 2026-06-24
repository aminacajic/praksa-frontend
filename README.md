# BH Sport – baza sportista Bosne i Hercegovine

Web aplikacija za prikaz sportova i sportista Bosne i Hercegovine, sa
administratorskim panelom za unos i uređivanje podataka. Projekat je
nastao kao prerada originalne vanilla JS/HTML/CSS verzije u modernu
React(Vite) frontend aplikaciju, sa zadržanim Node.js/Express
backendom kao API servisom.

## Korištene tehnologije

**Frontend**
- React 19, React Router DOM, Vite, CSS3 

**Backend**
- Node.js, Express.js, Multer, JSON fajl kao baza podataka 

**Eksterni API**
- [DummyJSON](https://dummyjson.com) – za stranicu "Vijesti" (sportski artikli)

## Funkcionalnosti

- **Pregled sportova, sa pretragom 
- **Pregled detalja sporta – galerija slika, lista sportista sa pretragom
- **Pregled detalja sportiste – biografija i najveći uspjesi
- **Pregled artikala – dohvat artikala sa eksternog API-ja
- **Admin panel**
  - dodavanje / uređivanje sporta (naziv, opis, slika, galerija, pozicije)
  - dodavanje / uređivanje sportiste (ime, pozicija, slika, biografija) uz
    mogućnost dodavanja nove pozicije direktno iz forme
  - pregled, pretraga i brisanje sportova/sportista

## Pokretanje projekta

Potrebno je pokrenuti **backend** i **frontend** odvojeno (u dva terminala).

### 1. Backend (API server)

```bash
cd backend
npm install
npm start
```

Server se pokreće na `http://localhost:3000` 

### 2. Frontend (React aplikacija)

```bash
cd frontend
npm install
npm run dev
```

Aplikacija se pokreće na `http://localhost:5173`. 

### 3. Produkcijski build frontenda

```bash
cd frontend
npm run build
```