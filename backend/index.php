<?php
header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "poruka" => "Dobrodošli na BH Sport API backend!",
    "status" => "aktivan",
    "dostupni_endpointi" => [
        "GET /get_sportovi.php" => "Prikaz svih sportova, pozicija i sportista",
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
