<?php
// =============================================
//  register.php — GradMatch
// =============================================

session_start();
require 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: Regis.html');
    exit;
}

// Ambil data dari form
$nama      = trim($_POST['nama']      ?? '');
$username  = trim($_POST['username']  ?? '');
$email     = trim($_POST['email']     ?? '');
$telepon   = trim($_POST['telepon']   ?? '');
$lokasi    = trim($_POST['lokasi']    ?? '');
$password  = $_POST['password']       ?? '';
$confirm   = $_POST['confirm_password'] ?? '';
$pendidikan = $_POST['pendidikan']    ?? '';
$jurusan   = trim($_POST['jurusan']   ?? '');

// Validasi
if (!$nama || !$username || !$email || !$password || !$confirm) {
    header('Location: Regis.html?error=Harap+lengkapi+semua+kolom+yang+wajib+diisi');
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: Regis.html?error=Format+email+tidak+valid');
    exit;
}
if (strlen($password) < 8) {
    header('Location: Regis.html?error=Password+minimal+8+karakter');
    exit;
}
if ($password !== $confirm) {
    header('Location: Regis.html?error=Konfirmasi+password+tidak+cocok');
    exit;
}

// Cek email & username sudah terdaftar
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? OR username = ?');
$stmt->execute([$email, $username]);
if ($stmt->fetch()) {
    header('Location: Regis.html?error=Email+atau+username+sudah+terdaftar');
    exit;
}

// Simpan ke database
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('
    INSERT INTO users (nama, username, email, password, telepon, lokasi, pendidikan, jurusan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
');
$stmt->execute([$nama, $username, $email, $hash, $telepon, $lokasi, $pendidikan, $jurusan]);

// Auto login setelah register
$_SESSION['user_id']  = $pdo->lastInsertId();
$_SESSION['nama']     = $nama;
$_SESSION['username'] = $username;

header('Location: Home.html');
exit;