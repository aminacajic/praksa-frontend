<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/konekcija.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["poruka" => "Metoda nije dozvoljena."]);
    exit;
}

$sportistaId = (int) ($_POST["sportistaId"] ?? 0);
$sportId     = (int) ($_POST["sportId"]     ?? 0);
$novoIme     = trim($_POST["ime"]   ?? "");
$novaUloga   = trim($_POST["uloga"] ?? "");
$noviInfo    = trim($_POST["info"]  ?? "");

if ($sportistaId <= 0 || $sportId <= 0 || $novoIme === "" || $novaUloga === "") {
    http_response_code(400);
    echo json_encode(["poruka" => "sportistaId, sportId, ime i uloga su obavezni!"]);
    exit;
}

$stmtFind = $konekcija->prepare(
    "SELECT id, slika FROM sportisti WHERE id = ? AND sport_id = ?"
);
$stmtFind->execute([$sportistaId, $sportId]);
$sportista = $stmtFind->fetch();

if (!$sportista) {
    http_response_code(404);
    echo json_encode(["poruka" => "Sportista sa ID-em $sportistaId nije pronađen u ovom sportu."]);
    exit;
}

$putanjaSlika = $sportista["slika"];

$dirSlike = __DIR__ . "/images/";
if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] === UPLOAD_ERR_OK) {
    if (!is_dir($dirSlike)) mkdir($dirSlike, 0777, true);
    $ext      = strtolower(pathinfo($_FILES["slika"]["name"], PATHINFO_EXTENSION));
    $novoIme2 = time() . "_" . bin2hex(random_bytes(4)) . "." . $ext;
    if (move_uploaded_file($_FILES["slika"]["tmp_name"], $dirSlike . $novoIme2)) {
        $putanjaSlika = "./images/" . $novoIme2;
    }
}

$konekcija->prepare(
    "UPDATE sportisti SET ime=?, uloga=?, info=?, slika=? WHERE id=?"
)->execute([$novoIme, $novaUloga, $noviInfo, $putanjaSlika, $sportistaId]);

$konekcija->prepare("INSERT IGNORE INTO pozicije (sport_id, naziv) VALUES (?, ?)")
    ->execute([$sportId, $novaUloga]);

echo json_encode(["poruka" => "Podaci o sportisti su uspješno izmijenjeni!"], JSON_UNESCAPED_UNICODE);
