<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . "/config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["poruka" => "Metoda nije dozvoljena."]);
    exit;
}

$naziv    = trim($_POST["naziv"]   ?? "");
$opis     = trim($_POST["opis"]    ?? "");
$savez    = trim($_POST["savez"]   ?? "");
$pozicije = json_decode($_POST["pozicije"] ?? "[]", true);

if ($naziv === "") {
    http_response_code(400);
    echo json_encode(["poruka" => "Naziv sporta je obavezan!"]);
    exit;
}

$dirSlike = __DIR__ . "/images/";
if (!is_dir($dirSlike)) mkdir($dirSlike, 0777, true);

$putanjaGlavne = "./images/placeholder.png";
if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] === UPLOAD_ERR_OK) {
    $ext     = strtolower(pathinfo($_FILES["slika"]["name"], PATHINFO_EXTENSION));
    $novoIme = "sport_" . time() . "_" . bin2hex(random_bytes(4)) . "." . $ext;
    if (move_uploaded_file($_FILES["slika"]["tmp_name"], $dirSlike . $novoIme)) {
        $putanjaGlavne = "./images/" . $novoIme;
    }
}

$konekcija->beginTransaction();
try {
    $stmt = $konekcija->prepare(
        "INSERT INTO sportovi (naziv, opis, savez, slika) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$naziv, $opis, $savez, $putanjaGlavne]);
    $sportId = (int) $konekcija->lastInsertId();

    if (isset($_FILES["galerija"]["name"])) {
        $fajlovi = $_FILES["galerija"];
        $stmtGal = $konekcija->prepare(
            "INSERT INTO galerija (sport_id, slika, redoslijed) VALUES (?, ?, ?)"
        );
        $red = 1;
        for ($i = 0; $i < count($fajlovi["name"]); $i++) {
            if ($fajlovi["error"][$i] !== UPLOAD_ERR_OK) continue;
            $ext     = strtolower(pathinfo($fajlovi["name"][$i], PATHINFO_EXTENSION));
            $novoIme = "gal_" . time() . "_" . bin2hex(random_bytes(2)) . "_$i.$ext";
            if (move_uploaded_file($fajlovi["tmp_name"][$i], $dirSlike . $novoIme)) {
                $stmtGal->execute([$sportId, "./images/" . $novoIme, $red++]);
            }
        }
    }

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
    echo json_encode([
        "poruka" => "Novi sport uspješno kreiran!",
        "id"     => $sportId,
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    $konekcija->rollBack();
    http_response_code(500);
    echo json_encode(["poruka" => "Greška pri upisivanju: " . $e->getMessage()]);
}
