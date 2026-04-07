<?php
// =============================================
//  profil.php — GradMatch
//  Mengembalikan data profil user dalam JSON
//  untuk ditampilkan di Profil.html via fetch()
// =============================================

session_start();
require 'koneksi.php';

header('Content-Type: application/json');

// Cek session
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Belum login.']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Ambil data user
$stmt = $pdo->prepare('
    SELECT id, nama, username, email, telepon, lokasi, bio,
           pendidikan, jurusan, tanggal_lahir, gender, foto_profil, created_at
    FROM users WHERE id = ?
');
$stmt->execute([$user_id]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'User tidak ditemukan.']);
    exit;
}

// Ambil skills user
$stmt = $pdo->prepare('
    SELECT s.nama, s.kategori, us.level
    FROM user_skills us
    JOIN skills s ON s.id = us.skill_id
    WHERE us.user_id = ?
');
$stmt->execute([$user_id]);
$skills = $stmt->fetchAll();

// Ambil riwayat lamaran
$stmt = $pdo->prepare('
    SELECT l.status, l.created_at, j.nama_posisi, j.nama_perusahaan
    FROM lamaran l
    JOIN jobs j ON j.id = l.job_id
    WHERE l.user_id = ?
    ORDER BY l.created_at DESC
');
$stmt->execute([$user_id]);
$lamaran = $stmt->fetchAll();

echo json_encode([
    'status'  => 'success',
    'user'    => $user,
    'skills'  => $skills,
    'lamaran' => $lamaran,
]);