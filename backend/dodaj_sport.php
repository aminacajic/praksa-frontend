<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$jsonPutanja = __DIR__ . '/data/podaci.json';
$direktorijZaSlike = __DIR__ . '/images/';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = trim($_POST["id"] ?? "");
    $naziv = trim($_POST["naziv"] ?? "");
    $opis = trim($_POST["opis"] ?? "");
    $savez = trim($_POST["savez"] ?? "");
    $pozicije = json_decode($_POST["pozicije"] ?? "[]", true);

    if ($id === "" || $naziv === "") {
        http_response_code(400);
        echo json_encode(["poruka" => "ID i naziv sporta su obavezni!"]);
        exit;
    }

    if (!is_dir($direktorijZaSlike)) {
        mkdir($direktorijZaSlike, 0777, true);
    }

    $putanjaGlavneSlike = "./images/placeholder.png";
    if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] === UPLOAD_ERR_OK) {
        $ekstenzija = pathinfo($_FILES["slika"]["name"], PATHINFO_EXTENSION);
        $novoIme = "sport_" . time() . "_" . bin2hex(random_bytes(2)) . "." . $ekstenzija;
        if (move_uploaded_file($_FILES["slika"]["tmp_name"], $direktorijZaSlike . $novoIme)) {
            $putanjaGlavneSlike = "./images/" . $novoIme;
        }
    }

    $putanjeGalerije = [];
    if (isset($_FILES["galerija"])) {
        $fajlovi = $_FILES["galerija"];
        for ($i = 0; $i < count($fajlovi["name"]); $i++) {
            if ($fajlovi["error"][$i] === UPLOAD_ERR_OK) {
                $ekstenzija = pathinfo($fajlovi["name"][$i], PATHINFO_EXTENSION);
                $novoImeG = "gal_" . time() . "_" . bin2hex(random_bytes(2)) . "_" . $i . "." . $ekstenzija;
                if (move_uploaded_file($fajlovi["tmp_name"][$i], $direktorijZaSlike . $novoImeG)) {
                    $putanjeGalerije[] = "./images/" . $novoImeG;
                }
            }
        }
    }

    $sportovi = json_decode(file_get_contents($jsonPutanja), true);

    foreach ($sportovi as $s) {
        if ($s["id"] === $id) {
            http_response_code(400);
            echo json_encode(["poruka" => "Sport sa ovim ID-em već postoji!"]);
            exit;
        }
    }

    $noviSport = [
        "id" => $id,
        "naziv" => $naziv,
        "opis" => $opis,
        "savez" => $savez,
        "slika" => $putanjaGlavneSlike,
        "galerija" => $putanjeGalerije,
        "pozicije" => $pozicije,
        "sportisti" => []
    ];

    $sportovi[] = $noviSport;
    file_put_contents($jsonPutanja, json_encode($sportovi, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(["poruka" => "Novi sport uspješno kreiran!"]);
}
