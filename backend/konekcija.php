<?php
$host = "localhost";
$user = "root";
$pass = "";
$db_name = "praksa_sportovi";

try {
    $konekcija = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $user, $pass);
    $konekcija->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Greška pri povezivanju na bazu: " . $e->getMessage());
}
