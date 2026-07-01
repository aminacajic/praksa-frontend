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

$sportId = (int) ($_POST["sportId"] ?? 0);
$ime     = trim($_POST["ime"]     ?? "");
$uloga   = trim($_POST["uloga"]   ?? "");
$info    = trim($_POST["info"]    ?? "");

if ($sportId <= 0 || $ime === "" || $uloga === "") {
    http_response_code(400);
    echo json_encode(["poruka" => "sportId, ime i uloga su obavezni!"]);
    exit;
}

try {
    $stmtFind = $konekcija->prepare("SELECT id FROM sportovi WHERE id = ?");
    $stmtFind->execute([$sportId]);
    if (!$stmtFind->fetch()) {
        http_response_code(404);
        echo json_encode(["poruka" => "Sport sa ID-em $sportId nije pronađen u bazi."]);
        exit;
    }

    $dirSlike = __DIR__ . "/images/";
    if (!is_dir($dirSlike)) {
        mkdir($dirSlike, 0777, true);
    }

    $putanjaSlika = "./images/placeholder.png";
    if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] === UPLOAD_ERR_OK) {
        $ext     = strtolower(pathinfo($_FILES["slika"]["name"], PATHINFO_EXTENSION));
        $novoIme = time() . "_" . bin2hex(random_bytes(4)) . "." . $ext;
        if (move_uploaded_file($_FILES["slika"]["tmp_name"], $dirSlike . $novoIme)) {
            $putanjaSlika = "./images/" . $novoIme;
        }
    }

    $stmt = $konekcija->prepare(
        "INSERT INTO sportisti (sport_id, ime, uloga, info, slika) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([$sportId, $ime, $uloga, $info, $putanjaSlika]);
    $noviId = (int) $konekcija->lastInsertId();

    $konekcija->prepare("INSERT IGNORE INTO pozicije (sport_id, naziv) VALUES (?, ?)")
        ->execute([$sportId, $uloga]);

    echo json_encode([
        "poruka" => "Sportista uspješno dodan!",
        "id"     => $noviId,
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["poruka" => "Greška sa bazom: " . $e->getMessage()]);
}
