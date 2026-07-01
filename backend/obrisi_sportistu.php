<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

require_once __DIR__ . "/config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["poruka" => "Metoda nije dozvoljena."]);
    exit;
}

$ulaz        = json_decode(file_get_contents("php://input"), true);
$sportistaId = (int) ($ulaz["sportistaId"] ?? 0);

if ($sportistaId <= 0) {
    http_response_code(400);
    echo json_encode(["poruka" => "sportistaId je obavezan i mora biti broj."]);
    exit;
}

$stmt = $konekcija->prepare("DELETE FROM sportisti WHERE id = ?");
$stmt->execute([$sportistaId]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["poruka" => "Sportista uspješno obrisan!"], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(404);
    echo json_encode(["poruka" => "Sportista sa tim ID-em nije pronađen u bazi."], JSON_UNESCAPED_UNICODE);
}
