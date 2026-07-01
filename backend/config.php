<?php
$host    = "localhost";
$user    = "root";
$pass    = "";
$db_name = "praksa_sportovi";

try {
    $konekcija = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $user, $pass);
    $konekcija->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $konekcija->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Greška pri povezivanju na bazu: " . $e->getMessage());
}
