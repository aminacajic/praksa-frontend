<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$jsonPutanja = __DIR__ . '/data/podaci.json';
$ulaz = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] === "POST" && $ulaz) {
    $sportId = trim($ulaz["sportId"] ?? "");
    $ime = trim($ulaz["ime"] ?? "");

    if ($sportId === "" || $ime === "") {
        http_response_code(400);
        echo json_encode(["poruka" => "Nedostaju parametri za brisanje."]);
        exit;
    }

    $sportovi = json_decode(file_get_contents($jsonPutanja), true);
    $obrisano = false;

    foreach ($sportovi as &$sport) {
        if ($sport["id"] === $sportId) {
            $pocetniBroj = count($sport["sportisti"]);

            $sport["sportisti"] = array_values(array_filter($sport["sportisti"], function ($sp) use ($ime) {
                return $sp["ime"] !== $ime;
            }));

            if (count($sport["sportisti"]) < $pocetniBroj) {
                $obrisano = true;
            }
            break;
        }
    }

    if ($obrisano) {
        file_put_contents($jsonPutanja, json_encode($sportovi, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["poruka" => "Sportista uspješno obrisan!"]);
    } else {
        http_response_code(404);
        echo json_encode(["poruka" => "Sportista nije pronađen u bazi."]);
    }
}
