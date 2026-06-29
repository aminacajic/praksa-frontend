<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$jsonPutanja = __DIR__ . '/data/podaci.json';
$direktorijZaSlike = __DIR__ . '/images/';

if (!file_exists($jsonPutanja)) {
    http_response_code(404);
    echo json_encode(["poruka" => "Greška: Baza podaci.json ne postoji na putanji."]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $sportId = trim($_POST["sportId"] ?? "");
    $originalnoIme = trim($_POST["originalnoIme"] ?? "");
    $novoIme = trim($_POST["ime"] ?? "");
    $novaUloga = trim($_POST["uloga"] ?? "");
    $noviInfo = trim($_POST["info"] ?? "");

    if ($sportId === "" || $originalnoIme === "" || $novoIme === "" || $novaUloga === "") {
        http_response_code(400);
        echo json_encode(["poruka" => "Sva obavezna polja moraju biti popunjena!"]);
        exit;
    }

    $sportovi = json_decode(file_get_contents($jsonPutanja), true);
    $izmijenjeno = false;

    foreach ($sportovi as &$sport) {
        if ($sport["id"] === $sportId) {
            foreach ($sport["sportisti"] as &$sp) {

                if (trim($sp["ime"]) === trim($originalnoIme)) {
                    // Zadržavamo staru sliku kao default ako se nova ne učita
                    $putanjaSlikeZaJson = $sp["slika"] ?? "./images/placeholder.png";

                    // Obrada nove slike
                    if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] === UPLOAD_ERR_OK) {
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

                    // Ažuriramo objekat sportiste
                    $sp = [
                        "ime" => htmlspecialchars($novoIme),
                        "uloga" => htmlspecialchars($novaUloga),
                        "info" => htmlspecialchars($noviInfo),
                        "slika" => $putanjaSlikeZaJson
                    ];
                    $izmijenjeno = true;
                    break;
                }
            }

            if ($izmijenjeno && isset($sport["pozicije"]) && !in_array($novaUloga, $sport["pozicije"])) {
                $sport["pozicije"][] = $novaUloga;
            }
            break;
        }
    }

    if ($izmijenjeno) {
        $uspesnoUpisano = file_put_contents($jsonPutanja, json_encode($sportovi, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        if ($uspesnoUpisano !== false) {
            echo json_encode(["poruka" => "Podaci i slika o sportisti su uspješno izmijenjeni!"]);
        } else {
            http_response_code(500);
            echo json_encode(["poruka" => "Greška na serveru: Nemam dozvolu za pisanje u podaci.json!"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["poruka" => "Sportista sa imenom '$originalnoIme' nije pronađen."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["poruka" => "Nevalidan zahtjev."]);
}
