<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/config.php";

$pojam = trim($_GET['pojam'] ?? '');

if ($pojam === '') {
    require __DIR__ . "/get_sportovi.php";
    exit;
}

$like = "%" . $pojam . "%";

$sql = "
    SELECT DISTINCT s.id, s.naziv, s.slika, s.opis, s.savez
    FROM sportovi s
    WHERE s.naziv LIKE :pojam
       OR s.id IN (
           SELECT DISTINCT sp.sport_id
           FROM sportisti sp
           WHERE sp.ime LIKE :pojam OR sp.uloga LIKE :pojam
       )
    ORDER BY s.id ASC
";

$stmt = $konekcija->prepare($sql);
$stmt->execute([":pojam" => $like]);
$sportovi = $stmt->fetchAll();

$stmtGal = $konekcija->prepare("SELECT slika FROM galerija WHERE sport_id = ? ORDER BY redoslijed ASC");
$stmtPoz = $konekcija->prepare("SELECT naziv FROM pozicije WHERE sport_id = ? ORDER BY id ASC");
$stmtSvi = $konekcija->prepare("SELECT id, ime, uloga, info, slika FROM sportisti WHERE sport_id = ? ORDER BY ime ASC");
$stmtSp  = $konekcija->prepare("
    SELECT id, ime, uloga, info, slika
    FROM sportisti
    WHERE sport_id = ? AND (ime LIKE ? OR uloga LIKE ?)
    ORDER BY ime ASC
");

$rezultat = [];

foreach ($sportovi as $sport) {
    $sportId = (int) $sport["id"];

    $stmtGal->execute([$sportId]);
    $galerija = array_column($stmtGal->fetchAll(), "slika");

    $stmtPoz->execute([$sportId]);
    $pozicije = array_column($stmtPoz->fetchAll(), "naziv");

    $nazivOdgovara = mb_stripos($sport["naziv"], $pojam) !== false;

    if ($nazivOdgovara) {
        $stmtSvi->execute([$sportId]);
        $sportisti = $stmtSvi->fetchAll();
    } else {
        $stmtSp->execute([$sportId, $like, $like]);
        $sportisti = $stmtSp->fetchAll();
    }

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
