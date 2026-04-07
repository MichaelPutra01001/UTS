<?php
// =============================================
//  koneksi.php — GradMatch
// =============================================

$host     = 'localhost';
$db       = 'PemWeb';
$user     = 'root';
$pass     = 'Angga2006';          // ganti sesuai password MySQL kamu
$charset  = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    die("Koneksi gagal: " . $e->getMessage());
}