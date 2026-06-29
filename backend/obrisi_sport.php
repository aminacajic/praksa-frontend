<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$jsonPutanja = __DIR__ . '/data/podaci.json';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $ulaz = json_decode(file_get_contents("php://input"), true);
    $sportId = trim($ulaz["sportId"] ?? "");

    if ($sportId === "") {
        http_response_code(400);
        echo json_encode(["poruka" => "ID sporta nedostaje!"]);
        exit;
    }

    $sportovi = json_decode(file_get_contents($jsonPutanja), true);
    $pocetniBroj = count($sportovi);

    $sportovi = array_values(array_filter($sportovi, function ($s) use ($sportId) {
        return $s["id"] !== $sportId;
    }));

    if (count($sportovi) < $pocetniBroj) {
        file_put_contents($jsonPutanja, json_encode($sportovi, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["poruka" => "Sport uspješno obrisan iz baze!"]);
    } else {
        http_response_code(404);
        echo json_encode(["poruka" => "Sport nije pronađen u bazi podaci.json."]);
    }
}
