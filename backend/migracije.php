<?php

$host    = "localhost";
$user    = "root";
$pass    = "";
$db_name = "praksa_sportovi";

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$db_name`");
    echo "Baza podataka '$db_name' je spremna.<br>";

    $pdo->exec("CREATE TABLE IF NOT EXISTS sportovi (
        id    INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
        naziv VARCHAR(255) NOT NULL,
        opis  TEXT,
        savez TEXT,
        slika VARCHAR(255) DEFAULT './images/placeholder.png'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS galerija (
        id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sport_id   INT          NOT NULL,
        slika      VARCHAR(255) NOT NULL,
        redoslijed INT          NOT NULL DEFAULT 0,
        FOREIGN KEY (sport_id) REFERENCES sportovi(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS pozicije (
        id       INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sport_id INT          NOT NULL,
        naziv    VARCHAR(100) NOT NULL,
        UNIQUE KEY uk_sport_poz (sport_id, naziv),
        FOREIGN KEY (sport_id) REFERENCES sportovi(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS sportisti (
        id       INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sport_id INT          NOT NULL,
        ime      VARCHAR(150) NOT NULL,
        uloga    VARCHAR(100),
        info     TEXT,
        slika    VARCHAR(255) DEFAULT './images/placeholder.png',
        FOREIGN KEY (sport_id) REFERENCES sportovi(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    echo "Sve tabele su uspješno kreirane.<br>";

    $provjera = $pdo->query("SELECT COUNT(*) FROM sportovi")->fetchColumn();

    if ($provjera == 0) {

        $stmtSport = $pdo->prepare(
            "INSERT INTO sportovi (naziv, opis, savez, slika) VALUES (?, ?, ?, ?)"
        );

        $sportovi = [
            [
                "Nogomet",
                "Krovna kuća bh. fudbala - Nogometni/Fudbalski savez BiH.",
                "Nogometni/Fudbalski savez BiH (NFSBiH) osnovan je 1992. godine. Najveći uspjeh je plasman na SP u Brazilu 2014.",
                "./images/nogomet.png"
            ],
            [
                "Košarka",
                "Košarkaški savez Bosne i Hercegovine i naši Zmajevi.",
                "Košarkaški savez BiH (KSBiH). Istorijski uspjeh: EP za kadete (U16) 2015. godine.",
                "./images/kosarka.png"
            ],
            [
                "Rukomet",
                "Rukometni savez BiH - ponosni učesnici evropskih prvenstava.",
                "Rukometni savez BiH (RSBiH). Reprezentacija je višestruki učesnik Svjetskih i Evropskih prvenstava.",
                "./images/rukomet.png"
            ],
            [
                "Odbojka",
                "Odbojkaški savez BiH i uspjesi naših reprezentativki.",
                "Odbojkaški savez BiH (OSBiH). Ističu se uspjesi ženske seniorske reprezentacije i reprezentacije u sjedećoj odbojci.",
                "./images/odbojka.svg"
            ],
        ];

        foreach ($sportovi as $s) {
            $stmtSport->execute($s);
        }

        $idMap = [];
        foreach ($pdo->query("SELECT id, naziv FROM sportovi") as $red) {
            $idMap[$red["naziv"]] = (int) $red["id"];
        }

        $stmtGal = $pdo->prepare("INSERT INTO galerija (sport_id, slika, redoslijed) VALUES (?, ?, ?)");
        $galerija = [
            ["Nogomet", "./images/galerija_nogomet_1.jpg", 1],
            ["Nogomet", "./images/galerija_nogomet_2.jpg", 2],
            ["Košarka", "./images/galerija_kosarka_1.jpg", 1],
            ["Košarka", "./images/galerija_kosarka_2.jpg", 2],
            ["Rukomet", "./images/galerija_rukomet_1.jpg", 1],
            ["Rukomet", "./images/galerija_rukomet_2.jpg", 2],
            ["Odbojka", "./images/galerija_odbojka_1.jpg", 1],
            ["Odbojka", "./images/galerija_odbojka_2.jpg", 2],
        ];
        foreach ($galerija as [$naziv, $slika, $red]) {
            $stmtGal->execute([$idMap[$naziv], $slika, $red]);
        }

        $stmtPoz = $pdo->prepare("INSERT IGNORE INTO pozicije (sport_id, naziv) VALUES (?, ?)");
        $pozicije = [
            ["Nogomet", "Napadač"],
            ["Nogomet", "Vezni igrač"],
            ["Nogomet", "Golman"],
            ["Nogomet", "Odbrana"],
            ["Košarka", "Bek / Krilo"],
            ["Košarka", "Centar"],
            ["Košarka", "Bek šuter"],
            ["Košarka", "Playmaker"],
            ["Rukomet", "Golman"],
            ["Rukomet", "Lijevo krilo"],
            ["Rukomet", "Desno krilo"],
            ["Rukomet", "Bek"],
            ["Rukomet", "Pivot"],
            ["Odbojka", "Primač"],
            ["Odbojka", "Tehničar"],
            ["Odbojka", "Libero"],
            ["Odbojka", "Korektor"],
            ["Odbojka", "Srednji bloker"],
        ];
        foreach ($pozicije as [$naziv, $poz]) {
            $stmtPoz->execute([$idMap[$naziv], $poz]);
        }

        $stmtSp = $pdo->prepare(
            "INSERT INTO sportisti (sport_id, ime, uloga, info, slika) VALUES (?, ?, ?, ?, ?)"
        );
        $sportisti = [
            ["Nogomet", "Edin Džeko",        "Napadač",     "Najbolji strijelac u historiji reprezentacije BiH.",                       "./images/dzeko.jpg"],
            ["Nogomet", "Miralem Pjanić",    "Vezni igrač", "Dugogodišnji motor reprezentacije i bivši igrač Juventusa i Barcelone.",  "./images/pjanic.jpg"],
            ["Nogomet", "Kerim Alajbegovic", "Vezni igrač", "Rođen je u Njemačkoj. Karijeru je započeo u Red Bull Salzburgu.",         "./images/kerim.jpg"],
            ["Košarka", "Džanan Musa",       "Bek / Krilo", "Jedan od najboljih igrača Evrope i član Real Madrida.",                   "./images/musa.jpg"],
            ["Košarka", "Jusuf Nurkić",      "Centar",      "Uspješni bh. košarkaš u NBA ligi.",                                       "./images/nurkic.jpg"],
            ["Rukomet", "Benjamin Burić",    "Golman",      "Jedan od najboljih svjetskih rukometnih golmana, brani u Bundesligi.",     "./images/buric.png"],
            ["Odbojka", "Edina Begić",       "Primač",      "Dugogodišnja kapitenka i jedna od najboljih odbojkašica u regiji.",        "./images/begic.png"],
            ["Odbojka", "Elena Babić",       "Korektor",    "Iskusna odbojkašica bh. reprezentacije.",                                 "./images/babic.png"],
        ];
        foreach ($sportisti as [$naziv, $ime, $uloga, $info, $slika]) {
            $stmtSp->execute([$idMap[$naziv], $ime, $uloga, $info, $slika]);
        }

        echo "Početni podaci su uneseni u bazu podataka!<br>";
    } else {
        echo "Podaci već postoje u tabelama, preskačem unos početnih podataka.<br>";
    }

    echo "<br><b>Pregled tabela:</b><br>";
    foreach (["sportovi", "galerija", "pozicije", "sportisti"] as $t) {
        $n = $pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn();
        echo "• $t: <b>$n</b> redova<br>";
    }

    echo "<br>Baza je spremna za rad.";
} catch (PDOException $e) {
    die("Greška tokom setup-a baze: " . $e->getMessage());
}
