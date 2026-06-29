<?php
$host = "localhost";
$user = "root";
$pass = "";
$db_name = "praksa_sportovi";

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
    $pdo->exec("USE `$db_name`");
    echo "Baza podataka '$db_name' je spremna.<br>";

    $pdo->exec("CREATE TABLE IF NOT EXISTS sportovi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        naziv VARCHAR(255) NOT NULL,
        opis TEXT,
        savez TEXT,
        pozicije TEXT, 
        slika VARCHAR(255)
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS sportisti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sport_id INT NOT NULL,
        ime VARCHAR(100) NOT NULL,
        uloga VARCHAR(100),
        info TEXT,
        slika VARCHAR(255),
        FOREIGN KEY (sport_id) REFERENCES sportovi(id) ON DELETE CASCADE
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS galerija (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sport_id INT NOT NULL,
        slika VARCHAR(255) NOT NULL,
        FOREIGN KEY (sport_id) REFERENCES sportovi(id) ON DELETE CASCADE
    )");

    echo "Sve tabele su uspješno kreirane u MySQL-u!<br>";

    $provera = $pdo->query("SELECT COUNT(*) FROM sportovi")->fetchColumn();

    if ($provera == 0) {
        $pdo->exec("INSERT INTO sportovi (id, naziv, opis, savez, pozicije, slika) VALUES
        (1, 'Nogomet', 'Krovna kuća bh. fudbala - Nogometni/Fudbalski savez BiH.', 'Nogometni/Fudbalski savez BiH (NFSBiH) osnovan je 1992. godine. Najveći uspjeh reprezentacije je plasman na Svjetsko prvenstvo u Brazilu 2014. godine.', '[\"Napadač\", \"Vezni igrač\", \"Golman\", \"Odbrana\"]', './images/nogomet.png'),
        (2, 'Košarka', 'Košarkaški savez Bosne i Hercegovine i naši Zmajevi.', 'Košarkaški savez BiH (KSBiH). Pamti se istorijski uspjeh osvajanja Evropskog prvenstva za kadete (U16) 2015. godine.', '[\"Bek / Krilo\", \"Centar\", \"Bek šuter\", \"Playmaker\"]', './images/kosarka.png'),
        (3, 'Rukomet', 'Rukometni savez BiH - ponosni učesnici evropskih prvenstava.', 'Rukometni savez BiH (RSBiH). Reprezentacija je u više navrata izborila plasman na Svjetska i Evropska prvenstva.', '[\"Golman\", \"Lijevo krilo\", \"Desno krilo\", \"Bek\", \"Pivot\"]', './images/rukomet.png'),
        (4, 'Odbojka', 'Odbojkaški savez BiH i uspjesi naših reprezentativki.', 'Odbojkaški savez BiH (OSBiH). Posebno se ističu uspjesi ženske seniorske reprezentacije i reprezentacije u sjedećoj odbojci.', '[\"Primač\", \"Tehničar\", \"Libero\", \"Korektor\", \"Srednji bloker\"]', './images/odbojka.svg')");

        $pdo->exec("INSERT INTO sportisti (sport_id, ime, uloga, info, slika) VALUES
        (1, 'Edin Džeko', 'Napadač', 'Najbolji strijelac u historiji reprezentacije BiH...', './images/dzeko.jpg'),
        (1, 'Miralem Pjanić', 'Vezni igrač', 'Dugogodišnji motor reprezentacije i bivši igrač Juventusa i Barcelone.', './images/pjanic.jpg'),
        (1, 'Kerim Alajbegovic', 'Vezni igrač', 'Rođen je u Njemačkoj. Karijeru je započeo u Red Bull Salzburgu', './images/kerim.jpg'),
        (2, 'Džanan Musa', 'Bek / Krilo', 'Jedan od najboljih igrača Evrope i član Real Madrida.', './images/musa.jpg'),
        (2, 'Jusuf Nurkić', 'Centar', 'Uspješni bh. košarkaš u NBA ligi.', './images/nurkic.jpg'),
        (3, 'Benjamin Burić', 'Golman', 'Jedan od najboljih svjetskih rukometnih golmana, brani u Bundesligi.', './images/buric.png'),
        (4, 'Edina Begić', 'Primač', 'Dugogodišnja kapitenka i jedna od najboljih odbojkašica u regiji.', './images/begic.png'),
        (4, 'Elena Babić', 'Korektor', 'odb', './images/babic.png')");

        $pdo->exec("INSERT INTO galerija (sport_id, slika) VALUES
        (1, './images/galerija_nogomet_1.jpg'),
        (1, './images/galerija_nogomet_2.jpg'),
        (2, './images/galerija_kosarka_1.jpg'),
        (2, './images/galerija_kosarka_2.jpg'),
        (3, './images/galerija_rukomet_1.jpg'),
        (3, './images/galerija_rukomet_2.jpg'),
        (4, './images/galerija_odbojka_1.jpg'),
        (4, './images/galerija_odbojka_2.jpg')");

        echo "Početni podaci su uspješno uneseni u bazu podataka!<br>";
    } else {
        echo "Podaci već postoje u tabelama, preskačem unos početnih podataka.<br>";
    }

    echo "Baza je spremna za rad.";
} catch (PDOException $e) {
    die("Greška tokom setup-a baze: " . $e->getMessage());
}
