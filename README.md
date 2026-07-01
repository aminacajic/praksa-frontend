# BH Sport – baza sportista Bosne i Hercegovine

Web aplikacija za prikaz sportova i sportista Bosne i Hercegovine, sa administratorskim panelom za unos i uređivanje podataka. Izrađena u React-u (Vite) na frontendu i PHP + MySQL (PDO) na backendu.

Ovo je faza projekta frontend+backend (Week 1 + Week 2 + Week 3). Podaci o sportovima i sportistima se sada trajno čuvaju u MySQL bazi podataka, a sve izmjene u Admin panelu (dodaj / uredi / obriši) se šalju na PHP backend i ostaju sačuvane nakon ponovnog učitavanja stranice.

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

- **Frontend:** React (Vite), JavaScript, CSS
- **Backend:** PHP (PDO), REST-like endpointi koji vraćaju JSON
- **Baza podataka:** MySQL (`praksa_sportovi`)

## Baza podataka

Baza `praksa_sportovi` sadrži sljedeće tabele:

- **sportovi** – `id, naziv, opis, savez, slika`
- **galerija** – `id, sport_id, slika, redoslijed` (FK na `sportovi`, `ON DELETE CASCADE`)
- **pozicije** – `id, sport_id, naziv` (FK na `sportovi`, `ON DELETE CASCADE`, jedinstvena kombinacija sport_id + naziv)
- **sportisti** – `id, sport_id, ime, uloga, info, slika` (FK na `sportovi`, `ON DELETE CASCADE`)

Baza i tabele se kreiraju pokretanjem `backend/database.sql`. Skripta se može pokrenuti više puta bez dupliranja podataka, a ako se u nju doda nova tabela, ponovnim pokretanjem se kreira samo ta nova tabela dok postojeći podaci ostaju netaknuti.

---

## Pokretanje projekta

### 1. korak: Backend (PHP + XAMPP)

1. Pokrenite lokalni server **XAMPP** i ugasite sistemski MySQL ako pravi konflikt na portu `3306` (na Macu komandom `sudo pkill -x mysqld`).
2. Uključite **Apache Web Server** i **MySQL Database** unutar XAMPP kontrolne table.
3. Postavite cijeli `backend` folder unutar serverskog `htdocs` direktorija na sljedeću putanju:
   - **Mac:** `/Applications/XAMPP/xamppfiles/htdocs/praksa/backend/`
   - **Windows:** `C:\xampp\htdocs\praksa\backend\`

### 2. korak: Kreiranje i uvoz baze podataka

Najbrži i najsigurniji način za uvoz baze na macOS-u je direktno kroz ugrađeni VS Code terminal:

1. Otvorite projektni folder u **VS Code**.
2. Otvorite novi terminal u VS Code (`Terminal → New Terminal`).
3. Ako baza pod nazivom `praksa_sportovi` još ne postoji, kreirajte je pokretanjem komande:

   ```bash
   /Applications/XAMPP/xamppfiles/bin/mysqladmin -u root create praksa_sportovi
   ```

4. Uvezite tabele i početne (seed) podatke iz `database.sql` komandom:

   ```bash
   /Applications/XAMPP/xamppfiles/bin/mysql -u root praksa_sportovi < backend/database.sql
   ```

**Testiranje backenda**

Da biste provjerili da li backend uspješno komunicira sa bazom, otvorite sljedeći URL u browseru:

```
http://localhost/praksa/backend/get_sportovi.php
```

Ako server vrati podatke o sportovima u čitljivom JSON formatu, backend je uspješno konfigurisan.

### 3. korak: Frontend (React + Vite)

Otvorite poseban terminal za frontend folder i pokrenite sljedeće komande:

```bash
cd frontend
npm install
npm run dev
```

Aplikacija će se pokrenuti lokalno na adresi `http://localhost:5173` i automatski će slati API zahtjeve prema PHP backendu na `http://localhost/praksa/backend/`.

**Produkcijski build frontenda**

```bash
cd frontend
npm run build
```

## Napomena o rukovanju podacima

Slike koje se uploaduju kroz Admin formu (za sportove i sportiste) šalju se na backend i trajno se snimaju u direktorij `backend/images`, dok se njihove relativne putanje upisuju u bazu podataka. Zahvaljujući postavljenim stranim ključevima (FOREIGN KEY), brisanjem sporta iz baze se automatski i kaskadno brišu svi povezani unosi iz tabela `galerija`, `pozicije` i `sportisti`.
