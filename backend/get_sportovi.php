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

if (!file_exists($jsonPutanja)) {
    http_response_code(404);
    echo json_encode(["poruka" => "PHP Greška: Fajl ne postoji na putanji: " . $jsonPutanja]);
    exit;
}

$siroviPodaci = file_get_contents($jsonPutanja);
$sportovi = json_decode($siroviPodaci, true);

if ($sportovi === null) {
    http_response_code(500);
    echo json_encode(["poruka" => "PHP Greška: JSON unutar podaci.json nije validan."]);
    exit;
}

echo json_encode($sportovi, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
