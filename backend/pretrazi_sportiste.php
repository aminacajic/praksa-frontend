<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$jsonPutanja = __DIR__ . '/data/podaci.json';

if (!file_exists($jsonPutanja)) {
    http_response_code(404);
    echo json_encode(["poruka" => "Baza podaci.json ne postoji."]);
    exit;
}

// PHP hvata parametar iz URL-a pomoću $_GET niza 
$pojam = isset($_GET['pojam']) ? trim($_GET['pojam']) : '';
$pojamLower = mb_strtolower($pojam, 'UTF-8');

$sportovi = json_decode(file_get_contents($jsonPutanja), true);

// Ako je pojam prazan, vrati sve sportove bez filtriranja
if ($pojamLower === '') {
    echo json_encode($sportovi);
    exit;
}

$filtriraniRezultati = [];

foreach ($sportovi as $sport) {
    if (str_contains(mb_strtolower($sport['naziv'], 'UTF-8'), $pojamLower)) {
        $filtriraniRezultati[] = $sport;
        continue;
    }

    $pronadjeniSportisti = [];
    foreach ($sport['sportisti'] as $sportista) {
        $imeLower = mb_strtolower($sportista['ime'], 'UTF-8');
        $ulogaLower = mb_strtolower($sportista['uloga'] ?? '', 'UTF-8');

        if (str_contains($imeLower, $pojamLower) || str_contains($ulogaLower, $pojamLower)) {
            $pronadjeniSportisti[] = $sportista;
        }
    }

    if (count($pronadjeniSportisti) > 0) {
        $modifikovaniSport = $sport;
        $modifikovaniSport['sportisti'] = $pronadjeniSportisti;
        $filtriraniRezultati[] = $modifikovaniSport;
    }
}

echo json_encode($filtriraniRezultati, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
