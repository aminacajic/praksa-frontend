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

$ulaz    = json_decode(file_get_contents("php://input"), true);
$sportId = (int) ($ulaz["sportId"] ?? 0);

if ($sportId <= 0) {
    http_response_code(400);
    echo json_encode(["poruka" => "ID sporta nedostaje ili nije validan!"]);
    exit;
}

$stmt = $konekcija->prepare("DELETE FROM sportovi WHERE id = ?");
$stmt->execute([$sportId]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["poruka" => "Sport uspješno obrisan iz baze!"], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(404);
    echo json_encode(["poruka" => "Sport nije pronađen u bazi."], JSON_UNESCAPED_UNICODE);
}
