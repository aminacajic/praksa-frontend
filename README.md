# BH Sport – baza sportista Bosne i Hercegovine

Web aplikacija za prikaz sportova i sportista Bosne i Hercegovine, sa administratorskim panelom za unos i uređivanje podataka. Izrađena u React-u (Vite) na frontendu i PHP + MySQL (PDO) na backendu.

Ovo je faza projekta frontend+backend (Week 1 + Week 2 + Week 3). Podaci o sportovima i  sportistima se sada trajno čuvaju u MySQL bazi podataka, a sve izmjene u Admin panelu (dodaj / uredi / obriši) se šalju na PHP backend i ostaju sačuvane nakon ponovnog učitavanja stranice.

## Eksterni API

- [DummyJSON](https://dummyjson.com/) – za stranicu Vijesti (sportski artikli)

## Funkcionalnosti

- Pregled svih sportova, sa pretragom
- Pregled detalja sporta - galerija slika, lista sportista sa pretragom
- Pregled detalja sportiste – biografija i najveći uspjesi
- Pregled vijesti – dohvat artikala sa eksternog API-ja (Fetch API)
- Admin panel:
  - dodavanje / uređivanje sporta (naziv, opis, savez, slika, galerija, pozicije)
  - dodavanje / uređivanje sportiste (ime, pozicija/uloga, slika, info), uz mogućnost dodavanja nove pozicije direktno iz forme
  - pregled, pretraga i brisanje sportova/sportista
  - upload i trajno čuvanje slika na serveru (`backend/images`)

## Tehnologije

**Frontend:** React (Vite), JavaScript, CSS
**Backend:** PHP (PDO), REST-like endpointi koji vraćaju JSON
**Baza podataka:** MySQL (`praksa_sportovi`)

## Baza podataka

Baza `praksa_sportovi` sadrži sljedeće tabele:

- **sportovi** – `id, naziv, opis, savez, slika`
- **galerija** – `id, sport_id, slika, redoslijed` (FK na `sportovi`, `ON DELETE CASCADE`)
- **pozicije** – `id, sport_id, naziv` (FK na `sportovi`, `ON DELETE CASCADE`, jedinstvena kombinacija sport_id + naziv)
- **sportisti** – `id, sport_id, ime, uloga, info, slika` (FK na `sportovi`, `ON DELETE CASCADE`)

Baza i tabele se automatski kreiraju (ako ne postoje) pokretanjem `backend/migracije.php`, koji ujedno unosi i početne (seed) podatke o sportovima, sportistima i pozicijama ako su tabele prazne.

## Pokretanje projekta

### Backend (PHP + MySQL)

1. Pokrenuti lokalni server (npr. XAMPP/MAMP) sa PHP i MySQL servisima.
2. Postaviti `backend` folder unutar servera (npr. `htdocs/praksa/backend`).
3. U pretraživaču otvoriti `migracije.php` (`http://localhost/praksa/backend/migracije.php`) da se kreira baza, tabele i unesu početni podaci.

### Frontend (React + Vite)

```
cd frontend
npm install
npm run dev
```

Aplikacija se pokreće na `http://localhost:5173`, a komunicira sa backendom na `http://localhost/praksa/backend`.

### Produkcijski build

```
cd frontend
npm run build
```

## Napomena

Slike koje se uploaduju kroz Admin formu (za sportove i sportiste) šalju se na backend i trajno se snimaju u `backend/images`, a putanje se čuvaju u bazi podataka. Brisanjem sporta automatski se (kaskadno) brišu i povezana galerija, pozicije i sportisti iz baze.
