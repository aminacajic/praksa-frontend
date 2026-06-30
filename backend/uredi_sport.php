<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . "/konekcija.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["poruka" => "Metoda nije dozvoljena."]);
    exit;
}

$sportId  = (int) ($_POST["id"] ?? 0);
$naziv    = trim($_POST["naziv"]   ?? "");
$opis     = trim($_POST["opis"]    ?? "");
$savez    = trim($_POST["savez"]   ?? "");
$pozicije = json_decode($_POST["pozicije"] ?? "[]", true);

if ($sportId <= 0 || $naziv === "") {
    http_response_code(400);
    echo json_encode(["poruka" => "id i naziv su obavezni."]);
    exit;
}

$stmtFind = $konekcija->prepare("SELECT id, slika FROM sportovi WHERE id = ?");
$stmtFind->execute([$sportId]);
$sport = $stmtFind->fetch();

if (!$sport) {
    http_response_code(404);
    echo json_encode(["poruka" => "Sport nije pronađen."]);
    exit;
}

$dirSlike  = __DIR__ . "/images/";
$putanjaGl = $sport["slika"];

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] === UPLOAD_ERR_OK) {
    if (!is_dir($dirSlike)) mkdir($dirSlike, 0777, true);
    $ext     = strtolower(pathinfo($_FILES["slika"]["name"], PATHINFO_EXTENSION));
    $novoIme = "sport_" . time() . "." . $ext;
    if (move_uploaded_file($_FILES["slika"]["tmp_name"], $dirSlike . $novoIme)) {
        $putanjaGl = "./images/" . $novoIme;
    }
}

$konekcija->beginTransaction();
try {
    $konekcija->prepare(
        "UPDATE sportovi SET naziv=?, opis=?, savez=?, slika=? WHERE id=?"
    )->execute([$naziv, $opis, $savez, $putanjaGl, $sportId]);

    if (isset($_FILES["galerija"]["name"])) {
        $fajlovi = $_FILES["galerija"];
        $stmtGal = $konekcija->prepare(
            "INSERT INTO galerija (sport_id, slika, redoslijed) VALUES (?, ?, ?)"
        );
        $stmtMax = $konekcija->prepare("SELECT COALESCE(MAX(redoslijed),0) FROM galerija WHERE sport_id=?");
        $stmtMax->execute([$sportId]);
        $maxRed = (int) $stmtMax->fetchColumn();

        for ($i = 0; $i < count($fajlovi["name"]); $i++) {
            if ($fajlovi["error"][$i] !== UPLOAD_ERR_OK) continue;
            $ext     = strtolower(pathinfo($fajlovi["name"][$i], PATHINFO_EXTENSION));
            $novoIme = "gal_" . time() . "_$i.$ext";
            if (move_uploaded_file($fajlovi["tmp_name"][$i], $dirSlike . $novoIme)) {
                $stmtGal->execute([$sportId, "./images/" . $novoIme, ++$maxRed]);
            }
        }
    }

    $konekcija->prepare("DELETE FROM pozicije WHERE sport_id=?")->execute([$sportId]);
    if (!empty($pozicije)) {
        $stmtPoz = $konekcija->prepare(
            "INSERT IGNORE INTO pozicije (sport_id, naziv) VALUES (?, ?)"
        );
        foreach ($pozicije as $poz) {
            $poz = trim($poz);
            if ($poz !== "") $stmtPoz->execute([$sportId, $poz]);
        }
    }

    $konekcija->commit();
    echo json_encode(["poruka" => "Izmjene na sportu uspješno sačuvane!"], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    $konekcija->rollBack();
    http_response_code(500);
    echo json_encode(["poruka" => "Greška: " . $e->getMessage()]);
}
