<?php
session_start();
require 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: Login.html');
    exit;
}

$identifier = trim($_POST['username'] ?? '');
$password   = $_POST['password'] ?? '';

if (!$identifier || !$password) {
    header('Location: Login.html?error=Harap+isi+semua+kolom');
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1');
$stmt->execute([$identifier, $identifier]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    header('Location: Login.html?error=Email+atau+password+salah');
    exit;
}

// Simpan session
$_SESSION['user_id']  = $user['id'];
$_SESSION['nama']     = $user['nama'];
$_SESSION['username'] = $user['username'];
$_SESSION['role']     = $user['role'];

// Redirect berdasarkan role
if ($user['role'] === 'admin') {
    header('Location: admin_jobs.html');
} elseif ($user['role'] === 'recruiter') {
    header('Location: recruiter_jobs.html');
} else {
    header('Location: Home.html');
}
exit;