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

    if (!isset($_FILES["slika"])) {
        http_response_code(400);
        echo json_encode([
            "poruka" => "PHP nije primio sliku! Provjeri frontend formu. Primljeni tekstualni podaci: " . json_encode($_POST)
        ]);
        exit;
    }

    // Pokupi tekstualne podatke iz $_POST niza 
    $sportId = trim($_POST["sportId"] ?? "");
    $ime = trim($_POST["ime"] ?? "");
    $uloga = trim($_POST["uloga"] ?? "");
    $info = trim($_POST["info"] ?? "");

    if ($sportId === "" || $ime === "" || $uloga === "") {
        http_response_code(400);
        echo json_encode([
            "poruka" => "Nedostaju obavezna polja! Primio sam -> sportId: '$sportId', ime: '$ime', uloga: '$uloga'"
        ]);
        exit;
    }

    $putanjaSlikeZaJson = "./images/placeholder.png";

    if ($_FILES["slika"]["error"] === UPLOAD_ERR_OK) {
        $imeFajla = $_FILES["slika"]["name"];
        $privremenaPutanja = $_FILES["slika"]["tmp_name"];

        $ekstenzija = pathinfo($imeFajla, PATHINFO_EXTENSION);
        $novoImeFajla = time() . "_" . bin2hex(random_bytes(4)) . "." . $ekstenzija;

        $konacnoOdrediste = $direktorijZaSlike . $novoImeFajla;

        if (!is_dir($direktorijZaSlike)) {
            mkdir($direktorijZaSlike, 0777, true);
        }

        if (move_uploaded_file($privremenaPutanja, $konacnoOdrediste)) {
            $putanjaSlikeZaJson = "./images/" . $novoImeFajla;
        }
    }

    if (!file_exists($jsonPutanja)) {
        http_response_code(404);
        echo json_encode(["poruka" => "Greška: Baza podaci.json ne postoji u data folderu."]);
        exit;
    }

    $sportovi = json_decode(file_get_contents($jsonPutanja), true);
    $pronadjen = false;

    foreach ($sportovi as &$sport) {
        if ($sport["id"] === $sportId) {
            $noviSportista = [
                "ime" => htmlspecialchars($ime),
                "uloga" => htmlspecialchars($uloga),
                "info" => htmlspecialchars($info),
                "slika" => $putanjaSlikeZaJson
            ];

            $sport["sportisti"][] = $noviSportista;

            if (isset($sport["pozicije"]) && !in_array($uloga, $sport["pozicije"])) {
                $sport["pozicije"][] = $uloga;
            }

            $pronadjen = true;
            break;
        }
    }

    if ($pronadjen) {
        $uspesnoUpisano = file_put_contents($jsonPutanja, json_encode($sportovi, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        if ($uspesnoUpisano !== false) {
            echo json_encode(["poruka" => "Sportista sa slikom uspješno dodan!"]);
        } else {
            http_response_code(500);
            echo json_encode(["poruka" => "Greška: PHP nema dozvolu za pisanje u podaci.json."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["poruka" => "Greška: Sport sa ID-em '$sportId' nije pronađen."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["poruka" => "Metoda nije dozvoljena. Očekuje se POST zahtjev."]);
}
