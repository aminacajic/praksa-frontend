<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/config.php";

$sportovi = $konekcija
    ->query("SELECT id, naziv, opis, savez, slika FROM sportovi ORDER BY id ASC")
    ->fetchAll();

$stmtGal = $konekcija->prepare("SELECT slika FROM galerija WHERE sport_id = ? ORDER BY redoslijed ASC");
$stmtPoz = $konekcija->prepare("SELECT naziv FROM pozicije WHERE sport_id = ? ORDER BY id ASC");
$stmtSp  = $konekcija->prepare("SELECT id, ime, uloga, info, slika FROM sportisti WHERE sport_id = ? ORDER BY ime ASC");

$rezultat = [];

foreach ($sportovi as $sport) {
    $sportId = (int) $sport["id"];

    $stmtGal->execute([$sportId]);
    $galerija = array_column($stmtGal->fetchAll(), "slika");

    $stmtPoz->execute([$sportId]);
    $pozicije = array_column($stmtPoz->fetchAll(), "naziv");

    $stmtSp->execute([$sportId]);
    $sportisti = $stmtSp->fetchAll();
    foreach ($sportisti as &$sp) {
        $sp["id"] = (int) $sp["id"];
    }

    $rezultat[] = [
        "id"        => $sportId,
        "naziv"     => $sport["naziv"],
        "slika"     => $sport["slika"],
        "galerija"  => $galerija,
        "opis"      => $sport["opis"],
        "savez"     => $sport["savez"],
        "pozicije"  => $pozicije,
        "sportisti" => $sportisti,
    ];
}

echo json_encode($rezultat, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
