CREATE DATABASE IF NOT EXISTS praksa_sportovi
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE praksa_sportovi;

CREATE TABLE IF NOT EXISTS sportovi (
    id    INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    opis  TEXT,
    savez TEXT,
    slika VARCHAR(255) DEFAULT './images/placeholder.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS galerija (
    id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sport_id   INT          NOT NULL,
    slika      VARCHAR(255) NOT NULL,
    redoslijed INT          NOT NULL DEFAULT 0,
    FOREIGN KEY (sport_id) REFERENCES sportovi(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pozicije (
    id       INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sport_id INT          NOT NULL,
    naziv    VARCHAR(100) NOT NULL,
    UNIQUE KEY uk_sport_poz (sport_id, naziv),
    FOREIGN KEY (sport_id) REFERENCES sportovi(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sportisti (
    id       INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sport_id INT          NOT NULL,
    ime      VARCHAR(150) NOT NULL,
    uloga    VARCHAR(100),
    info     TEXT,
    slika    VARCHAR(255) DEFAULT './images/placeholder.png',
    FOREIGN KEY (sport_id) REFERENCES sportovi(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO sportovi (id, naziv, opis, savez, slika) VALUES
(1, 'Nogomet',
   'Krovna kuća bh. fudbala - Nogometni/Fudbalski savez BiH.',
   'Nogometni/Fudbalski savez BiH (NFSBiH) osnovan je 1992. godine. Najveći uspjeh je plasman na SP u Brazilu 2014.',
   './images/nogomet.png'),
(2, 'Košarka',
   'Košarkaški savez Bosne i Hercegovine i naši Zmajevi.',
   'Košarkaški savez BiH (KSBiH). Istorijski uspjeh: EP za kadete (U16) 2015. godine.',
   './images/kosarka.png'),
(3, 'Rukomet',
   'Rukometni savez BiH - ponosni učesnici evropskih prvenstava.',
   'Rukometni savez BiH (RSBiH). Reprezentacija je višestruki učesnik Svjetskih i Evropskih prvenstava.',
   './images/rukomet.png'),
(4, 'Odbojka',
   'Odbojkaški savez BiH i uspjesi naših reprezentativki.',
   'Odbojkaški savez BiH (OSBiH). Ističu se uspjesi ženske seniorske reprezentacije i reprezentacije u sjedećoj odbojci.',
   './images/odbojka.svg');

INSERT IGNORE INTO galerija (id, sport_id, slika, redoslijed) VALUES
(1, 1, './images/galerija_nogomet_1.jpg', 1),
(2, 1, './images/galerija_nogomet_2.jpg', 2),
(3, 2, './images/galerija_kosarka_1.jpg', 1),
(4, 2, './images/galerija_kosarka_2.jpg', 2),
(5, 3, './images/galerija_rukomet_1.jpg', 1),
(6, 3, './images/galerija_rukomet_2.jpg', 2),
(7, 4, './images/galerija_odbojka_1.jpg', 1),
(8, 4, './images/galerija_odbojka_2.jpg', 2);

INSERT IGNORE INTO pozicije (id, sport_id, naziv) VALUES
(1,  1, 'Napadač'),
(2,  1, 'Vezni igrač'),
(3,  1, 'Golman'),
(4,  1, 'Odbrana'),
(5,  2, 'Bek / Krilo'),
(6,  2, 'Centar'),
(7,  2, 'Bek šuter'),
(8,  2, 'Playmaker'),
(9,  3, 'Golman'),
(10, 3, 'Lijevo krilo'),
(11, 3, 'Desno krilo'),
(12, 3, 'Bek'),
(13, 3, 'Pivot'),
(14, 4, 'Primač'),
(15, 4, 'Tehničar'),
(16, 4, 'Libero'),
(17, 4, 'Korektor'),
(18, 4, 'Srednji bloker');

INSERT IGNORE INTO sportisti (id, sport_id, ime, uloga, info, slika) VALUES
(1, 1, 'Edin Džeko', 'Napadač',
   'Najbolji strijelac u historiji reprezentacije BiH.',
   './images/dzeko.jpg'),
(2, 1, 'Miralem Pjanić', 'Vezni igrač',
   'Dugogodišnji motor reprezentacije i bivši igrač Juventusa i Barcelone.',
   './images/pjanic.jpg'),
(3, 1, 'Kerim Alajbegovic', 'Vezni igrač',
   'Rođen je u Njemačkoj. Karijeru je započeo u Red Bull Salzburgu.',
   './images/kerim.jpg'),
(4, 2, 'Džanan Musa', 'Bek / Krilo',
   'Jedan od najboljih igrača Evrope i član Real Madrida.',
   './images/musa.jpg'),
(5, 2, 'Jusuf Nurkić', 'Centar',
   'Uspješni bh. košarkaš u NBA ligi.',
   './images/nurkic.jpg'),
(6, 3, 'Benjamin Burić', 'Golman',
   'Jedan od najboljih svjetskih rukometnih golmana, brani u Bundesligi.',
   './images/buric.png'),
(7, 4, 'Edina Begić', 'Primač',
   'Dugogodišnja kapitenka i jedna od najboljih odbojkašica u regiji.',
   './images/begic.png'),
(8, 4, 'Elena Babić', 'Korektor',
   'Iskusna odbojkašica bh. reprezentacije.',
   './images/babic.png');
